const axios = require('axios');
const https = require('https');
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')

exports.patchApiInfo = async function (apiName, apiVersion, environment, reqBody) {
    try {
        const instance = axios.patch({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        logger.log('info',`reqId: ${uniqueRqId}. Info about patch API service`);

        let apiId = apiName + "_" + apiVersion + "_" + environment;

        //await patchAdapter.patchApiState(req.params.apiName, req.params.apiVersion, req.params.environment, reqBody.apiState);

    }

    catch (error) {
        logger.log('error',`reqId: ${uniqueRqId}. error while patching the API service ${error}`);
        throw error;
    }
}
