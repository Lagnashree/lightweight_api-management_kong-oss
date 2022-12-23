var Validator = require('jsonschema').Validator;
var v = new Validator();
const apiInputSchema= require("../schema/apiInput");


function apiPostReqValidator(reqBody) {
    return v.validate(reqBody, apiInputSchema.schema);
}
function apiGetReqValidator() {
    
}
function apiDeleteReqValidator(req) {
    let validationResult={errors:[]};
    if (typeof req.params.apiName == 'undefined' || req.params.apiName == '' || typeof req.params.apiVersion == 'undefined' || req.params.apiVersion == '' || typeof req.params.environment == 'undefined' || req.params.environment == '') {
        validationResult.errors.push("apiName, apiVersionn and environment are manadatory field");
    }
    if (req.params.environment && !['prod', 'ppe', 'dev'].includes(req.params.environment.toLowerCase())) {
        validationResult.errors.push("Invalid environment field. Value should be one of dev, ppe, prod");
    }
}
module.exports = {
    apiPostReqValidator,
    apiGetReqValidator,
    apiDeleteReqValidator
}
