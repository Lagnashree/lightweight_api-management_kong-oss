let subscriptionSchema= {
    "id":"/subscriptionInput",
    "type": "object",
    "properties": 
    {
        "apiName": {
            "type": "string",
            "required": true,
            "minLength": 5, 
        },
        "apiKey": {
            "type": "string",
            "required": true,
            "minLength": 10
        },
        "subscriptionQuota": {
            "type": "object",
            "properties": {
                "quotaPerMonth":{
                    "type": "integer",
                    "required": true,
                    "minimum": 10,
                    "maximum": 50000

                },
                "quotaPerMin": {
                    "type": "integer",
                    "required": true,
                    "minimum": 10,
                    "maximum": 300
                }
            }  
        },
        "environment": {
            "type": "string",
            "required": true,
            "enum": ["dev","stage","prod"] 
        },
    }
};

module.exports = {
    subscriptionSchema
}