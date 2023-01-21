const axios = require('axios');
const https = require('https');
const logger = require('../config/winston').logger;
const gcsRepositiory = require("../repository/gcsRepository");
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')

exports.getSpecInfo = async function getSpecInfo (apiName, apiVersion, environment, uniqueRqId) {
    try {
        try {
            logger.log('info',`reqId: ${uniqueRqId}. Spec file is downloaded from gcs bucket`);
            return await gcsRepositiory.downloadFile(apiName, apiVersion, environment);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId},  Error while downloading spec file from GCS bucket,  ${error}`);
            throw new BaseError(internalServerError, `unable to download spec file from GCS for API ${apiName}`)
        }    
    }

    catch (error) {
        logger.log('error',`reqId: ${uniqueRqId}. error while get spec file from GCS ${error}`);
        throw error;
    }
}
