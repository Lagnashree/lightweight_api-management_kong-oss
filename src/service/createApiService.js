const axios = require('axios');
const https = require('https');
const logger = require('../config/winston').logger;
const gcsAdapter = require("../repository/gcsRepository");
const pubsubRepository = require("../repository/pubsubRepository");
const dbRepository = require("../repository/dbRepository");
const kongRepository = require("../repository/kongRepository");
const yaml = require('js-yaml');
const specValidator= require("../utils/specValidator");
let gitToken = process.env.GIT_TOKEN;
let kongAdminToken = process.env.KONG_ADMIN_TOKEN;
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')

let adminUrl = ''
let kongConfig = {
    headers: {
        'Kong-Admin-Token': kongAdminToken,
        'Content-Type': 'application/json'
    }
}
let gitConfig = {
    headers: {
        'Authorization': "token " + gitToken,
        'Accept': 'application/vnd.github.v3.raw'
    }
}
exports.postApiInvoker = async function (reqBody, uniqueRqId) {
    try {
        const instance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        //await dbRepository.postIntoDb(reqBody.apiVersion, reqBody.environment, reqBody.apiName, reqBody.catalogName, reqBody.apiSecurity, reqBody.apiOrg, reqBody.apiState, reqBody.enabled, reqBody.specUrl)
        let gatewayCreateServiceReqBody = {
            name: reqBody.apiName,
            protocol: 'https',
            host: reqBody.backendHost,
            port: 443
        }
        let specFileFromGit = '';
        let jsonSpecFile;
        let checkApispec;
        try {
            let downloadFileFromGit = await instance.get(reqBody.specUrl, gitConfig);
            if (downloadFileFromGit.status == 200) {
                specFileFromGit = downloadFileFromGit.data;
                jsonSpecFile = yaml.load(specFileFromGit);
                logger.log("info",`reqId:${uniqueRqId}. Details of the API: title: ${jsonSpecFile.info.title}, Version: ${jsonSpecFile.info.version}, Environment:${reqBody.environment}`);
            }
        }
        catch (error) {
            console.log('error');
            logger.log('error',`reqId: ${uniqueRqId}. Error while downloading spec file,  ${error}`);
            throw new BaseError(internalServerError, `unable to download spec file for API ${reqBody.apiName}`)
        }
        let validationErrorArr=[];
        try{        
            validationErrorArr= specValidator.openAPIValidator(jsonSpecFile);
        }
        catch(error){
            logger.log('error',`reqId: ${uniqueRqId}. Error while validation spec`);
            throw error;
        }
        if (validationErrorArr.length != 0){
                logger.log('error',`reqId: ${uniqueRqId}. Error while validation spec,  ${error}`);
                throw new BaseError(badRequest, JSON.stringify(validationErrorArr))
        }
        try {
                let deckFile= kongRepository.generateDeckDeclarativeFile(reqBody.apiName, jsonSpecFile, reqBody.backendHost);
                logger.log('info',`reqId: ${uniqueRqId}. The generated deck declarative file,  ${JSON.stringify(deckFile)}`);
                //await  kongRepository.deployToKong(deckFile,reqBody.apiName );
        }catch (error) {
                logger.log('error',`reqId: ${uniqueRqId}.  Error while deploying to kong gateway,  ${error}`);
                throw new BaseError(internalServerError, "Error while deploying to kong gateway ")
        }                 
        try {
            logger.log('info',`reqId: ${uniqueRqId}. Spec file is saved in gcs bucket`);
            //await gcsAdapter.postFile(reqBody.apiName, reqBody.apiVersion, reqBody.environment, specFileFromGit);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId},  Error while storing spec file in GCS,  ${error}`);
            throw new BaseError(internalServerError, `unable to store spec file in GCS for API ${reqBody.apiName}`)
        }
        const eventData = {
            apiTitle: reqBody.apiName,
            apiVersion: reqBody.apiVersion,
            environment: reqBody.environment,
            catalog: reqBody.catalogName,
            event: 'create'
        }
        try {
            //await pubsubRepository.postEvent(eventData);
            logger.log('info',`reqId: ${uniqueRqId}. Event is pubslied to topic`);
            logger.log('debug',`reqId: ${uniqueRqId}. Event is pubslied to topic with eventData: ${eventData}`);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId},  Error  while publishing events to pubsub,  ${error}`);
            throw new BaseError(internalServerError, `unable to publish creation message in pubsub for API ${apiName}`)
        }
        logger.log("info",`reqId: ${uniqueRqId}, All operations for POST API are successfully completed`);
        return { status: 201, detail: 'success' }
    }
    catch (error) {
        console.log(error);
        logger.log("error","error in create api service");
        throw error;
    }
}


