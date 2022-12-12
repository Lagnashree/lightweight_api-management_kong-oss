const expect= require("chai").expect;
const specValidator= require("../../utils/specValidator");
const fs = require('fs');
const yaml = require('js-yaml');


describe ('utils spec Validator',()=>{
    it('should return no validation error',() => {
        const data = yaml.load(fs.readFileSync('C:\\dev\\nodejs\\api-catalog-service-node-2\\src\\test\\utils\\testSpec.yaml', 'utf8'));
        return specValidator.openAPIValidator(data).then(validationResult => {
            expect(validationResult.length).to.equal(0)
        })
    }),
    it('should return validation error',() => {
        const data = yaml.load(fs.readFileSync('C:\\dev\\nodejs\\api-catalog-service-node-2\\src\\test\\utils\\testSpec2.yaml', 'utf8'));
        return specValidator.openAPIValidator(data).then(validationResult => {
            expect(validationResult.length).to.equal(3)
        })
    })
})