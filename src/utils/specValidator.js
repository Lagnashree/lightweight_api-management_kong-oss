const SwaggerParser = require("@apidevtools/swagger-parser");
const semver = require('semver');
const validator = require("email-validator");

exports.openAPIValidator = async function(jsonSpecFile){
    try {
        let validationErrorArr=[];
        checkApispec = await SwaggerParser.validate(jsonSpecFile);
        if (jsonSpecFile.info.description.length < 50) {
            validationErrorArr.push({
                location: 'info.specDescription',
                errorMsg: 'description should be minimum 50 characters long'
            });
        }
        if (semver.valid(jsonSpecFile.info.version) == null) {
            validationErrorArr.push({
                location: 'info.specVersion',
                errorMsg: 'Spec version should be semantic'
            });
        }
        if (validator.validate(jsonSpecFile.info.contact.email) == true) {
            let emailParts = jsonSpecFile.info.contact.email.split('@');
            let emailAddress = emailParts[1];
            if (emailAddress != "email.com")
                validationErrorArr.push({
                    location: 'info.contactDetails',
                    errorMsg: 'email adress should be organization email'
                });
        }
        else
            validationErrorArr.push({
                location: 'info.contactDetails',
                errorMsg: 'this is not a valid email address'
            });
        return validationErrorArr;    
    }
    catch (error) {
            
            throw error;
    }      
}