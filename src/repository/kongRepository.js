const yaml= require('yaml');
const fs= require('fs');
const { v4: uuid } = require("uuid");
const { getSecret } = require("../../conf/secretManager.js");
const cloudSecret = getSecret();
const childProcess= require('child_process')
const TEMP_FILE_DIR=process.env.TEMP_DIR || "../../tempdir";

function generateDeckDeclarativeFile(apiTitle, jsonSpecfile, backendHost) {
    let dnsParts = backendHost.split('://');
    let apiName= apiTitle.replace(/\s+/g, '-').toLowerCase();
      return {
            _format_version: "1.1",
            _info: {
              select_tags: [apiName],
            },
            services: [
              {
                host: dnsParts[1],
                name: apiName,
                port: (dnsParts[0]=="http") ? 80 : 443,
                protocol: dnsParts[0],
                read_timeout: 60000,
                retries: 5,
                read_timeout: 60000,
                routes: createRoutesFromSpec(jsonSpecfile,apiName),
                plugins: [{
                  name: "key-auth",
                  config: {
                    key_names: ["X-Client-Id"],
                    run_on_preflight: false,
                  },
                  enabled: true,
                }]
              },
            ],
          };
        };

    function createRoutesFromSpec(jsonSpecFile, apiName){
        let routesFromSpec = Object.keys(jsonSpecFile.paths).map((pathName,index) => {
            //console.log('pathname.......', pathName);
            const route = jsonSpecFile.paths[pathName];
            const operations = Object.keys(route);
            const upperOperations = operations.map(element => {
              return element.toUpperCase();
            });
            return {
                "name": `${apiName}-route${index}`,
                "paths": [pathName],
                "methods": upperOperations,
                "preserve_host": false,
                "protocols": ["https"],
                "regex_priority":0,
                "strip_path": false
            };
        
        })
        return routesFromSpec;
    }
    const deployToKong = async (deckJSONConfig, apiTitle) => {
         let apiName=apiTitle.replace(/\s+/g, '-').toLowerCase();
        const deckYMLConfig = yaml.stringify(deckJSONConfig);
        // Create file directory for using with the deck tool if it hasn't been made yet
        if (!fs.existsSync(TEMP_FILE_DIR)) {
          fs.mkdirSync(TEMP_FILE_DIR);
        }
        const fileName = `${TEMP_FILE_DIR}/${apiName}_${uuid()}.yaml`;
        fs.writeFileSync(fileName, deckYMLConfig);
        try {
          childProcess.execSync(
            `deck sync --headers Kong-Admin-Token:${cloudSecret.KONG_ADMIN_TOKEN} -s ${fileName} --kong-addr ${cloudSecret.KONG_ADMIN_URL}`
          );
        } catch (error) {
          throw error;
        }
        // Remove file after upload
        fs.rmSync(fileName);
      };
module.exports = {
    generateDeckDeclarativeFile,
    deployToKong
}
