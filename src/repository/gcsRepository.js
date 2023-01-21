const path = require("path");
const dotenv = require("dotenv");
const { Storage } = require("@google-cloud/storage");
const { getSecret } = require("../../conf/secretManager.js");
const cloudSecret = getSecret();
const projectId = process.env.PROJECT_ID;
let bucketName = cloudSecret.BUCKET_NAME;
const envFilePath = path.join(__dirname, "../../", ".env");
dotenv.config({ path: envFilePath });
const storage = new Storage({ projectId: projectId });

async function postFile(apiName, apiVersion, environment, fileContent) {
    let fileName = apiName.replace(/\s+/g, '-').toLowerCase() + "_" + apiVersion + "_" + environment + ".yml";
    await storage
        .bucket(bucketName)
        .file(fileName)
        .save(fileContent)
    console.log("file successfully uploaded to gcs bucket");
}

async function deleteFile(apiName, apiVersion, environment) {
    let fileName = apiName.replace(/\s+/g, '-').toLowerCase() + "_" + apiVersion + "_" + environment + ".yml";
    await storage
        .bucket(bucketName)
        .file(fileName.toLowerCase())
        .delete()
    console.log("file successfully deleted from gcs bucket");

}

async function downloadFile(apiName, apiVersion, environment, fileContent) {
    let fileName = apiName + "_" + apiVersion + "_" + environment + ".yml";
    let downloadedSpecFile = await storage
        .bucket(bucketName)
        .file(fileName)
        .download(fileContent)
    return downloadedSpecFile.toString();
}

module.exports = {
    postFile,
    deleteFile,
    downloadFile
}
