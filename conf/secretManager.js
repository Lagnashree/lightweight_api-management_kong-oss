const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

const envFilePath = path.join(__dirname, "./../", ".env");
dotenv.config({ path: envFilePath });

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const SECRETS_DIR_PATH = path.join(__dirname, ".secrets");
const SECRET_NAME = "runtime-secret";

const loadSecret = async () => {
  const name = `projects/${PROJECT_ID}/secrets/${SECRET_NAME}/versions/latest`;
  const [version] = await client.accessSecretVersion({
    name,
  });

  const secret = version.payload.data.toString();

  if (!fs.existsSync(SECRETS_DIR_PATH)) {
    fs.mkdirSync(SECRETS_DIR_PATH);
  }

  fs.writeFileSync(`${SECRETS_DIR_PATH}/${SECRET_NAME}`, secret);
};

const getSecret = () => {
  const secret = fs.readFileSync(`${SECRETS_DIR_PATH}/${SECRET_NAME}`);
  return JSON.parse(secret);
};

module.exports = { loadSecret, getSecret };
