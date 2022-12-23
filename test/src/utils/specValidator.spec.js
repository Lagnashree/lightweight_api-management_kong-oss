const expect= require("chai").expect;
const specValidator= require("../../../src/utils/specValidator");
const fs = require('fs');
const yaml = require('js-yaml');
var path = require('path');



describe ('utils spec Validator',()=>{
    it('should return no validation error',() => {
        var validfilePath = path.join(__dirname, './') + 'testSpec.yaml' ;
        const data = yaml.load(fs.readFileSync(validfilePath));
        return specValidator.openAPIValidator(data).then(validationResult => {
            expect(validationResult.length).to.equal(0)
        })
    }),
    it('should return validation error',() => {
        var invalidfilePath = path.join(__dirname, './') + 'testSpec2.yaml' ;
        const data = yaml.load(fs.readFileSync(invalidfilePath));
        return specValidator.openAPIValidator(data).then(validationResult => {
            expect(validationResult.length).to.equal(3)
        })
    })
})
