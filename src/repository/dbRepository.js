const knex = require('knex');
const path = require("path");
const moment = require('moment-timezone');
const pg = require('pg');
const { getSecret } = require("../../conf/secretManager.js");
const cloudSecret = getSecret();
let tableName = 'api_catalog_t';
const dotenv = require("dotenv");
const envFilePath = path.join(__dirname, "../../", ".env");
dotenv.config({ path: envFilePath });

async function getKnexClient() {
    return knex({
        client: 'pg',
        connection: {
            host: cloudSecret.POSTGRES_HOST,
            port: cloudSecret.POSTGRES_PORT,
            user: cloudSecret.POSTGRES_USERNAME,
            password: cloudSecret.POSTGRES_PASSWORD,
            database: cloudSecret.POSTGRES_DATABASE
        }
    })
}
async function getFromDb() {
    try {
        let knexClient = await getKnexClient();
        return await knexClient(tableName).select('*');
    }
    catch (error) {
        throw error;
    }
}

async function postIntoDb(apiVersion, environment, apiName, catalogName, apiSecurity, apiOrg, apiState, enabled, specUrl) {
    try {
        let apiId = apiName.replace(/\s+/g, '-').toLowerCase();
        let knexClient = await getKnexClient();
        await knexClient(tableName).insert({
            api_id: apiId,
            api_version: apiVersion,
            environment: environment,
            api_name: apiName,
            catalog_name: catalogName,
            api_security: apiSecurity,
            api_org: apiOrg,
            api_state: apiState,
            create_date: getTime(),
            enabled: true
        })
    }
    catch (error) {
       throw error;
    }
}

function getTime() {
    return moment().tz('Europe/Stockholm').format('YYYY-MM-DD HH:mm:ss z');

}

async function deleteFromDb(apiVersion, environment, apiName) {
    try {
        await knexClient(tableName).where('api_version', apiVersion).andWhere('environment', environment).andWhere('api_name', apiName).del();
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    postIntoDb,
    deleteFromDb,
    getFromDb 
}
