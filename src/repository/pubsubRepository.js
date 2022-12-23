const path = require("path");
const dotenv = require("dotenv");
const { PubSub } = require("@google-cloud/pubsub");
const { getSecret } = require("../../conf/secretManager.js");
const cloudSecret = getSecret();
const topicName = cloudSecret.PUBSUB_TOPIC;
const envFilePath = path.join(__dirname, "../../", ".env");
dotenv.config({ path: envFilePath });
exports.postEvent = async function (eventData) {
    const projectId = process.env.PROJECT_ID;
    let pubsub = new PubSub({ projectId: projectId });

    try {
        const data = JSON.stringify(eventData);
        const dataBuffer = Buffer.from(data);
        await pubsub
            .topic(topicName)
            .publish(dataBuffer);
    } catch (err) {
        console.log(err)
    }
};
