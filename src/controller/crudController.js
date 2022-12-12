const express = require('express');
const router = express.Router();
const logger = require('../config/winston').logger;
const postApi = require('../service/createApiService');
const getApiService = require('../service/getApiService');
const deleteApiService = require('../service/deleteApiService');
const patchApiService = require('../service/patchApiService');
const StatusCodes = require('http-status-codes');
const util= require('../utils/common');
var Validator = require('jsonschema').Validator;
var v = new Validator();
const apiInputSchema= require("../schema/apiInput");
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')

router.post('/', async (req, res) => {
    console.log("post");
    let responsePayload = {};
    let statusCode = 500;
    let reasonPhrase;
    let uniqueRqId = util.generateID();
    try {
        let validationResult= v.validate(req.body, apiInputSchema.schema);
        logger.log("debug",`Request under process successfully. reqId:${uniqueRqId}`);
        if(validationResult.errors.length>0){
            logger.log("error",`reqId:${uniqueRqId}. filed with bad request" : validationResult.errors`);
            throw new BaseError(badRequest, JSON.stringify(validationResult.errors));
        }
        const postAPIResult = await postApi.postApiInvoker(req.body, uniqueRqId);
        console.log(postAPIResult);
        if (postAPIResult.status === 201) {
            logger.log("info",`reqId:${uniqueRqId}. Request processed successfully`);
            statusCode = postAPIResult.status;
            responsePayload = postAPIResult.detail;
        }
    }
    catch (error) {
        logger.log("error",`reqId:${uniqueRqId}. Error while processing request ${error}`);
        console.log(error);
        responsePayload = {
            "title": reasonPhrase,
            "detail": error.message,
            "instance": '/api/v1/catalog-service',
            "operation": 'POST'
        }
    }
    res.status(statusCode).set('Req-ID', uniqueRqId).send(responsePayload);
})



router.get('/', async (req, res) => {
    console.log("get");
    let statusCode = 404;
    let reasonPhrase;
    let page = req.query.page;
    let limit = req.query.limit;
    let apiInfoResponse;
    try {
        apiInfoResponse = await getApiService.getApiInfo(page, limit);
    }
    catch (error) {
        console.log('error', error)
    }
    statusCode = 200;
    res.status(statusCode).send(apiInfoResponse);

})



router.delete('/:apiName/:apiVersion/:environment', async (req, res) => {
    let statusCode = 404;
    let reasonPhrase = 'BAD_REQUEST';
    try {
        if (typeof req.params.apiName == 'undefined' || req.params.apiName == '' || typeof req.params.apiVersion == 'undefined' || req.params.apiVersion == '' || typeof req.params.environment == 'undefined' || req.params.environment == '') {
            statusCode = StatusCodes.BAD_REQUEST;
            reasonPhrase = 'BAD_REQUEST';
            throw new BaseError(badRequest, "apiName, apiVersionn and environment are manadatory field");
        }
        else if (req.params.environment && !['prod', 'ppe', 'dev'].includes(req.params.environment.toLowerCase())) {
            statusCode = StatusCodes.BAD_REQUEST;
            reasonPhrase = 'BAD_REQUEST';
            throw new BaseError(badRequest, "Invalid environment field. Value should be one of dev, ppe, prod");
        }
        let deleteInfo = await deleteApiService.deleteApiInfo(req.params.apiName, req.params.apiVersion, req.params.environment);
        if (deleteInfo.status === 200) {
            console.log('deleteInfo', deleteInfo.detail);
            statusCode = deleteInfo.status;
        }
        statusCode = StatusCodes.OK;
    }
    catch (error) {
        /*responsePayload = {
            "type": errorType,
            "title": reasonPhrase,
            "status": statusCode,
            "operation": 'delete'
        }*/
        console.log(error);
    }
    res.status(statusCode).send('success');
})


router.patch('/:apiName/:apiVersion/:environment', async (req, res) => {
    let statusCode = 404;
    let reasonPhrase = 'BAD_REQUEST';
    try {
        if (typeof req.params.apiName == 'undefined' || req.params.apiName == '' || typeof req.params.apiVersion == 'undefined' || req.params.apiVersion == '' || typeof req.params.environment == 'undefined' || req.params.environment == '') {
            statusCode = StatusCodes.BAD_REQUEST;
            reasonPhrase = 'BAD_REQUEST';
            throw new BaseError(badRequest, "apiName, apiVersionn and environment are manadatory field");
        }
        else if (req.params.environment && !['prod', 'ppe', 'cte-f'].includes(req.params.environment.toLowerCase())) {
            statusCode = StatusCodes.BAD_REQUEST;
            reasonPhrase = 'BAD_REQUEST';
            throw new BaseError(badRequest, "Invalid environment field. Value should be one of cte-f, ppe, prod");
        }
        let patchInfo = await patchApiService.patchApiInfo(req.params.apiName, req.params.apiVersion, req.params.environment.toUpperCase(), req.body);
        if (subscriptionInfo.status === 200) {
            console.log('patchInfo', patchInfo.detail);
            statusCode = patchInfo.status;
        }
        statusCode = StatusCodes.OK;
    }
    catch (error) {
        responsePayload = {
            "type": errorType,
            "title": reasonPhrase,
            "status": statusCode,
            "operation": 'patch'
        }
    }
    res.status(statusCode).send(responsePayload);
})


module.exports = router;
