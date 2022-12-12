const expect= require("chai").expect;
const specValidator= require("../../utils/specValidator");
const fs = require('fs');
const yaml = require('js-yaml');


describe ('Kong Repository',()=>{
    describe ('generate Deck Declarative File',()=>{
        it('should return valid deck declarite file',() => {
            const data = yaml.load(fs.readFileSync('C:\\dev\\nodejs\\api-catalog-service-node-2\\src\\test\\repository\\testSpec.yaml', 'utf8'));
            const deckConfData = yaml.load(fs.readFileSync('C:\\dev\\nodejs\\api-catalog-service-node-2\\src\\test\\repository\\validDeckConf.yaml', 'utf8'));
            const deckConfFile= generateDeckDeclarativeFile(apiName, data, backendHost)
            expect(deckConfData).to.equal(deckConfFile);
        }),
        it('should return validation error',() => {
            const data = yaml.load(fs.readFileSync('C:\\dev\\nodejs\\api-catalog-service-node-2\\src\\test\\utils\\testSpec2.yaml', 'utf8'));
            return specValidator.openAPIValidator(data).then(validationResult => {
                expect(validationResult.length).to.equal(3)
            })
        })
   })
})