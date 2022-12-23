const expect= require("chai").expect;
const requestValidator= require('../../../src/utils/requestValidator');
describe ('Input Request body Validator',()=>{
    describe ('Post API Input Request body Validator',()=>{
        it('should return no validation error',(done) => {
            let RequestBody= {
                environment: "dev",
                catalogName: "public",
                apiSecurity: "apiKey",
                apiOrg: "MyOrg",
                apiState: "published",
                backendHost: "https://localhost",
                specUrl: "https://raw.githubusercontent.com/Lagnashree/carCongestionTax/main/src/main/java/com/volvo/carCongestionTax/api/apiSpec.yaml"
            }
            let validationResult= requestValidator.apiPostReqValidator(RequestBody);
            expect(validationResult.errors.length).to.equal(0)
            done()
        }),
        it('should return validation error',(done) => {
            let RequestBodyError= {
                "environment": "dev2",
                "catalogName": "public",
                "apiSecurity": "apiKey",
                "apiOrg": "MyOrg",
                "apiState": "published2",
                "backendHost": "https://localhost",
                "specUrl": "http://raw.githubusercontent.com/Lagnashree/carCongestionTax/main/src/main/java/com/volvo/carCongestionTax/api/apiSpec.yaml"
            }
            let validationResult= requestValidator.apiPostReqValidator(RequestBodyError);
            expect(validationResult.errors.length).to.equal(2)
            done()
        })
    })
})
