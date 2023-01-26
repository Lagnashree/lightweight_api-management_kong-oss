const express = require('express');
const router = express.Router();
const logger = require('../config/winston').logger;
const postApi = require('../service/createApiService');
const getApiService = require('../service/getApiService');
const getSpecService = require('../service/getSpecService');
const deleteApiService = require('../service/deleteApiService');
const patchApiService = require('../service/patchApiService');
const StatusCodes = require('http-status-codes');
const util= require('../utils/common');
const requestValidator= require("../utils/requestValidator");
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')

router.post('/', async (req, res) => {
    console.log("post");
    let responsePayload = {};
    let statusCode = 500;
    let reasonPhrase ='BAD_REQUEST';
    let uniqueRqId = util.generateID();
    try {
        let validationResult= requestValidator.apiPostReqValidator(req.body);
        if(validationResult.errors.length>0){
            logger.log("error",`reqId:${uniqueRqId}. filed with bad request" : validationResult.errors`);
            statusCode = 400;
            throw new BaseError(badRequest, JSON.stringify(validationResult.errors));
        }
        const postAPIResult = await postApi.postApiInvoker(req.body, uniqueRqId);
        if (postAPIResult.status === 201) {
            logger.log("info",`reqId:${uniqueRqId}. Request processed successfully`);
            statusCode = postAPIResult.status;
            responsePayload = postAPIResult.detail;
        }
    }
    catch (error) {
        logger.log("error",`reqId:${uniqueRqId}. Error while processing request ${error}`);
        responsePayload = {
            "detail": error.message,
            "instance": '/api/v1/catalog-service/api',
            "operation": 'POST'
        }
    }
    res.status(statusCode).set('Req-ID', uniqueRqId).send(responsePayload);
})



router.get('/', async (req, res) => {
    let uniqueRqId = util.generateID();
    let statusCode = 500;
    let page = req.query.page;
    let limit = req.query.limit;
    let apiInfoResponse;
    try {
        apiInfoResponse = await getApiService.getApiInfo(page, limit);
        statusCode = 200;
        logger.log('info',`reqId: ${uniqueRqId}.processing request GET api information `);
    }
    catch (error) {
        logger.log("error",`reqId:${uniqueRqId}. Error while processing request GET api information ${error}`);
        responsePayload = {
            "detail": error.message,
            "instance": '/api/v1/catalog-service/api',
            "operation": 'GET'
        }
    }
    res.status(statusCode).send(apiInfoResponse);

})



router.delete('/:apiName/:apiVersion/:environment', async (req, res) => {
    let uniqueRqId = util.generateID();
    let statusCode = 500;
    let responsePayload='success';
    try {
        let validationResult= requestValidator.apiDeleteReqValidator(req);
        if(validationResult.errors.length>0){
            statusCode = 400;
            logger.log("error",`reqId:${uniqueRqId}. filed with bad request" : validationResult.errors`);
            throw new BaseError(badRequest, JSON.stringify(validationResult.errors));
        }
        let deleteInfo = await deleteApiService.deleteApiInfo(req.params.apiName, req.params.apiVersion, req.params.environment, uniqueRqId);
        if (deleteInfo.status === 200) {
            statusCode = deleteInfo.status;
        }
    }
    catch (error) {
        logger.log("error",`reqId:${uniqueRqId}. Error while processing request DELETE api information ${error}`);
        responsePayload = {
            "detail": error.message,
            "instance": `/api/v1/catalog-service/api/${req.params.apiName}/${req.params.apiVersion}/${req.params.environment}`,
            "operation": 'DELETE'
        }
    }
    res.status(statusCode).set('Req-ID', uniqueRqId).send(responsePayload);
})


router.patch('/:apiName/:apiVersion/:environment', async (req, res) => {
    let uniqueRqId = util.generateID();
    let statusCode = 404;
    let responsePayload='success';
    try {
        let patchValidationResult= requestValidator.apiPatchReqValidator(req);
        if(patchValidationResult.errors.length>0){
            statusCode = 400;
            logger.log("error",`reqId:${uniqueRqId}. filed with bad request" : patchValidationResult.errors`);
            throw new BaseError(badRequest, JSON.stringify(patchValidationResult.errors));
        }
        let patchInfo = await patchApiService.patchApiInfo(req.params.apiName, req.params.apiVersion, req.params.environment, uniqueRqId);
        if (patchInfo.status === 200) {
            statusCode = patchInfo.status;
        }
        statusCode = StatusCodes.OK;
    }
    catch (error) {
        logger.log("error",`reqId:${uniqueRqId}. Error while processing request PATCH api information ${error}`);
        responsePayload = {
            "detail": error.message,
            "instance": `/api/v1/catalog-service/api/${req.params.apiName}/${req.params.apiVersion}/${req.params.environment}`,
            "operation": 'PATCH'
        }
    }
    res.status(statusCode).set('Req-ID', uniqueRqId).send(responsePayload);
})
    
router.get('/getSpec/:apiName/:apiVersion/:environment', async (req, res) => {
    let uniqueRqId = util.generateID();
    let statusCode = 500;
    let responsePayload;
    try {
        let getSpecValidationResult = requestValidator.getSpecReqValidator(req);
        console.log('getSpecValidationResult',getSpecValidationResult);
        if(getSpecValidationResult.errors.length>0){
            statusCode = 400;
            logger.log("error",`reqId:${uniqueRqId}. filed with bad request" : getSpecValidationResult.errors`);
            throw new BaseError(badRequest, JSON.stringify(getSpecValidationResult.errors));
        }
        responsePayload = await getSpecService.getSpecInfo(req.params.apiName, req.params.apiVersion, req.params.environment, uniqueRqId);
        statusCode = 200;
    }
    catch (error) {
        console.log('error in controller',error);
        responsePayload = {
            "detail": error.message,
            "instance": `/api/v1/catalog-service/api/${req.params.apiName}/${req.params.apiVersion}/${req.params.environment}`,
            "operation": 'GET'
        }
    }
    res.status(statusCode).set('Req-ID', uniqueRqId).send(responsePayload);
})


module.exports = router;
