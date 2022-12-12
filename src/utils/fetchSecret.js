const path = require("path");

exports.getCloudSecret = async function () {
    /*const projectId = process.env.GCP_PROJECT_ID;
    serviceKey = path.join(__dirname, "..", "/service-account.json");
    const name = 'projects/' + projectId + '/secrets/api-catalog-node-secret/versions/latest';
    const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
        name: name,
        keyFilename: serviceKey
    });
    return JSON.parse(version.payload.data.toString());*/
    return {
        POSTGRES_USERNAME: "postgres",
        POSTGRES_PASSWORD: "9474367757",
    }
}