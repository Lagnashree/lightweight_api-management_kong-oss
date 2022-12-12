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
            //"pattern": "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$"
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