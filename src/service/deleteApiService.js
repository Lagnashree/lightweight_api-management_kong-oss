const axios = require('axios');
const https = require('https');
const gcsAdapter = require("../repository/gcsRepository");
const pubsubRepository = require("../repository/pubsubRepository");
const dbRepository = require("../repository/dbRepository");
let kongAdminToken = process.env.KONG_ADMIN_TOKEN;
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')

let kongConfig = {
    headers: {
        'Kong-Admin-Token': kongAdminToken
    }
}

exports.deleteApiInfo = async function (apiName, apiVersion, environment) {
    try {
        const instance = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });

        await dbRepository.deleteFromDb(apiVersion, environment, apiName);
        logger.log('info',`reqId: ${uniqueRqId}. Deleting the API from DB`);

        try {
            let gatewayDeleteResponse = await instance.delete(`${process.env.GW_URL}/services/${apiName}`, kongConfig);
            logger.log('debug',`reqId: ${uniqueRqId}. Deleting the API from gateway ${gatewayDeleteResponse}`); 
            if (gatewayDeleteResponse.status == 200)
            logger.log('info',`reqId: ${uniqueRqId}. The API is successfully deleted from gateway`);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId}. error while deleting the API from gateway ${error}`);
            throw new BaseError(internalServerError, `unable to delete from kong gateway for API ${apiName}`)
        }

        try {
            await gcsAdapter.deleteFile(apiName, apiVersion, environment);
            logger.log('info',`reqId: ${uniqueRqId}. Deleting the API from GCS bucket`);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId}. error while deleting the API from GCS bucket ${error}`);
            throw new BaseError(internalServerError, `unable to delete from GCS bucket for API ${apiName}`)
        }

        const eventData = {
            apiTitle: apiName,
            apiVersion: apiVersion,
            environment: environment,
            event: 'delete'
        }

        try {
            await pubsubRepository.postEvent(eventData);
            logger.log('info',`reqId: ${uniqueRqId}. Publishing deletion message of the API into pubsub`);
        }
        catch (error) {
            logger.log('error',`reqId: ${uniqueRqId}. error while publishing deletion message in the pubsub ${error}`);
            throw new BaseError(internalServerError, `unable to publish deletion message in pubsub for API ${apiName}`)
        }

        return { status: 200, detail: 'The API has been successfully deleted ' }
    }


    catch (error) {
        logger.log('error',`reqId: ${uniqueRqId}. error while deleting the API service ${error}`);
        throw error;
    }
}
