let schema= {
    "id":"/apiInput",
    "type": "object",
    "properties": {
        "environment": {
            "type": "string",
            "required": true,
            "enum": ["dev","stage","prod"] 
        },
        "catalogName": {
            "type": "string",
            "required": true,
            "enum": ["internal","public"] 
        },
        "apiSecurity": {
            "type": "string",
            "required": true,
            "enum": ["apiKey","bearer"] 
        },
        "apiOrg": {
            "type": "string",
            "required": true,
            "minLength": 5
        },
        "apiState": {
            "type": "string",
            "required": true,
            "enum": ["published","deprecated", "retired"] 
        },
        "backendHost": {
            "type": "string",
            "required": true,
            "minLength": 15,
            "pattern": "^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$"
        },
        "specUrl": {
            "type": "string",
            "required": true,
            "minLength": 15
        }
    }
};

module.exports = {
    schema
}
