const path = require("path");
const { Storage } = require("@google-cloud/storage");

let serviceKey = "";
const projectId = process.env.PROJECT_ID;
let bucketName = process.env.BUCKET_NAME;
serviceKey = path.join(__dirname, "..", "/service-account.json");
const storage = new Storage({ projectId: projectId, keyFilename: serviceKey });

async function postFile(apiName, apiVersion, environment, fileContent) {
    let fileName = apiName + "_" + apiVersion + "_" + environment + ".yml";
    await storage
        .bucket(bucketName)
        .file(fileName)
        .save(fileContent)
    console.log("file successfully uploaded to gcs bucket");
}

async function deleteFile(apiName, apiVersion, environment) {
    let fileName = apiName + "_" + apiVersion + "_" + environment + ".yml";
    await storage
        .bucket(bucketName)
        .file(fileName.toLowerCase())
        .delete()
    console.log("file successfully deleted from gcs bucket");

}

module.exports = {
    postFile,
    deleteFile
}
