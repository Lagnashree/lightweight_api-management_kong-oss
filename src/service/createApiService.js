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
            throw new BaseError(internalServerError, `unable to download spec file for API ${jsonSpecFile.info.title}`)
        }
        let validationErrorArr=[];
        try{        
            validationErrorArr= await specValidator.openAPIValidator(jsonSpecFile);
            console.log(validationErrorArr);
        }
        catch(error){
            logger.log('error',`reqId: ${uniqueRqId}. Error while validation spec`);
            throw error;
        }
        if (validationErrorArr.length != 0){
                logger.log('error',`reqId: ${uniqueRqId}. Error while validation spec`);
                throw new BaseError(badRequest, JSON.stringify(validationErrorArr))
        }
        try {
            await dbRepository.postIntoDb(jsonSpecFile.info.version, reqBody.environment, jsonSpecFile.info.title, reqBody.catalogName, reqBody.apiSecurity, reqBody.apiOrg, reqBody.apiState, reqBody.enabled, reqBody.specUrl)
        }catch (error) {
            console.log('error in DB operation');
            logger.log('error',`reqId: ${uniqueRqId}. Error whilesaving metadata to DB,  ${error}`);
            throw new BaseError(internalServerError, `Error whilesaving metadata to DB ${jsonSpecFile.info.title}`)
        }
        try {
                let deckFile= kongRepository.generateDeckDeclarativeFile(jsonSpecFile.info.title, jsonSpecFile, reqBody.backendHost);
                console.log('deckFile',deckFile)
                logger.log('info',`reqId: ${uniqueRqId}. The generated deck declarative file,  ${JSON.stringify(deckFile)}`);
                //await  kongRepository.deployToKong(deckFile,reqBody.apiName );
        }catch (error) {
                logger.log('error',`reqId: ${uniqueRqId}.  Error while deploying to kong gateway,  ${error}`);
                throw new BaseError(internalServerError, "Error while deploying to kong gateway ")
        }                 
        try {
            await gcsAdapter.postFile(jsonSpecFile.info.title, jsonSpecFile.info.version, reqBody.environment, specFileFromGit);
            logger.log('info',`reqId: ${uniqueRqId}. Spec file is saved in gcs bucket`);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId},  Error while storing spec file in GCS,  ${error}`);
            throw new BaseError(internalServerError, `unable to store spec file in GCS for API ${jsonSpecFile.info.title}`)
        }
        const eventData = {
            apiTitle: jsonSpecFile.info.title,
            apiVersion: jsonSpecFile.info.version,
            environment: reqBody.environment,
            catalog: reqBody.catalogName,
            event: 'create'
        }
        try {
            await pubsubRepository.postEvent(eventData);
            logger.log('info',`reqId: ${uniqueRqId}. Event is pubslied to topic`);
            logger.log('debug',`reqId: ${uniqueRqId}. Event is pubslied to topic with eventData: ${eventData}`);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId},  Error  while publishing events to pubsub,  ${error}`);
            throw new BaseError(internalServerError, `unable to publish creation message in pubsub for API ${jsonSpecFile.info.title}`)
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
