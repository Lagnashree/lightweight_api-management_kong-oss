const axios = require('axios');
const https = require('https');
const dbRepository = require("../repository/dbRepository");
const logger = require('../config/winston').logger;
let kongAdminToken = process.env.KONG_ADMIN_TOKEN;
const { BaseError, notFound, internalServerError, serviceUnavailable, badRequest } = require('../utils/error')

let kongConfig = {
    headers: {
        'Kong-Admin-Token': kongAdminToken
    }
}
const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

exports.getApiInfo = async function (page, limit, uniqueRqId) {

    let listOfApisFromDb;
    let apiPresentInGw;
    try {
        listOfApisFromDb = await dbRepository.getFromDb();
        logger.log('info',`reqId: ${uniqueRqId}. list of API's is returned from DB`);
        let validApiInGwArray = await Promise.all(
            listOfApisFromDb.map(async (api) => {
                apiPresentInGw = await checkApiInGateway(api.api_name);
                logger.log('info',`reqId: ${uniqueRqId}. getting the information if the API is present in the gateway`);
                if (apiPresentInGw == true)
                    return { ...api, presentInGW: true };
                else
                    return { ...api, presentInGW: false };
            })
        )
        console.log(validApiInGwArray);
        return validApiInGwArray;
    }
    catch (error) {
        logger.log('error',`reqId: ${uniqueRqId},  Error in finding API in the gateway,  ${error}`);
        throw error;
    }
}
async function checkApiInGateway(api_name) {
    try {
        console.log(api_name);
        let gatewayApiNamePresentResponse = await instance.get(`${process.env.GW_URL}/services/${api_name}`, kongConfig);
        if (gatewayApiNamePresentResponse.status == 200)
            return true;
        else
            return false;
    }
    catch (error) {
        if (error.response.status == 404)
            return false;
        else
            throw new BaseError(internalServerError, `Internal server error the API ${apiNameInDb}`)
    }
}



