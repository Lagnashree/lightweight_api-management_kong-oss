const axios = require('axios');
const https = require('https');
const logger = require('../config/winston').logger;
const gcsAdapter = require("../repository/gcsRepository");
const pubsubRepository = require("../repository/pubsubRepository");
const dbRepository = require("../repository/dbRepository");
const { getSecret } = require("../../conf/secretManager.js");
const cloudSecret = getSecret();
let kongAdminToken =cloudSecret.KONG_ADMIN_TOKEN;
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')


const kongConfig = {
    headers: {
        'Kong-Admin-Token': kongAdminToken
    }
}
const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
exports.deleteApiInfo = async function (apiName, apiVersion, environment, uniqueRqId) {
    try {
        

        await dbRepository.deleteFromDb(apiVersion, environment, apiName);
        logger.log('info',`reqId: ${uniqueRqId}. Deleting the API from DB`);

        try {
            const kongRouters= await getKongRouter(apiName);
            for (const kongRoute of kongRouters) {
                await deleteKongRouter(kongRoute.id);
            }
            await deleteKongService(apiName);
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

async function getKongRouter(apiName)
{
    try {
        let kongRouteForApi = await instance.get(`${cloudSecret.KONG_ADMIN_URL}/services/${apiName}/routes`, kongConfig);
        console.log(kongRouteForApi.data.data);
        return kongRouteForApi.data.data;
    }
    catch(error)
    {
        throw error;
    }
}
async function deleteKongRouter(routeId)
{
    try {
        return await instance.delete(`${cloudSecret.KONG_ADMIN_URL}/routes/${routeId}`, kongConfig);
    }
    catch(error)
    {
        throw error;
    }
}
async function deleteKongService(apiName)
{
    try {
        return instance.delete(`${cloudSecret.KONG_ADMIN_URL}/services/${apiName}`, kongConfig);
    }
    catch(error)
    {
        throw error;
    }
}
