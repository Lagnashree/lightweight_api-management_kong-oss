const knex = require('knex');
const moment = require('moment-timezone');
const pg = require('pg');
const fetchSecret = require("../utils/fetchSecret");
let tableName = process.env.TABLE_NAME;

async function getKnexClient() {
    let cloudSecret = await fetchSecret.getCloudSecret();
    return knex({
        client: 'pg',
        connection: {
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            user: cloudSecret.POSTGRES_USERNAME,
            password: cloudSecret.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE
        }
    })
}
async function getFromDb() {
    try {
        let knexClient = await getKnexClient();
        return await knexClient(tableName).select('*');
    }
    catch (error) {
        console.log(error)

    }
}

async function postIntoDb(apiVersion, environment, apiName, catalogName, apiSecurity, apiOrg, apiState, enabled, specUrl) {
    try {
        let apiId = apiName + "_" + apiVersion + "_" + environment;
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
            enabled: enabled
        })
    }
    catch (error) {
        console.log(error)
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
        console.log(error)

    }
}

module.exports = {
    postIntoDb,
    deleteFromDb,
    getFromDb
}