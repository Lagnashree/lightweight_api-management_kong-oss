const genereratedDeckConf = {
  "_format_version": "1.1",
  "_info": {
    "select_tags": [
      "testapi"
    ]
  },
  "services": [
    {
      "name": "testapi",
      "host": "localhost",
      "port": "443",
      "protocol": "https",
      "read_timeout": 60000,
      "retries": 5,
      "routes": [
        { 
          "name": "testapi-route0",
          "paths": "/tax_calculator",
          "operation": [
            "post"
          ],
          "preserve_host": false,
          "protocols": "https",
          "regex_priority": 0,
          "strip_path": false
        },
        {
          "name": "testapi-route1",
          "paths": "/nontaxable_vehicle",
          "operation": [
            "post",
            "get"
          ],
          "preserve_host": false,
          "protocols": "https",
          "regex_priority": 0,
          "strip_path": false
        },
        {
          "name": "testapi-route2",
          "paths": "/nontaxable_vehicle/{id}",
          "operation": [
            "delete"
          ],
          "preserve_host": false,
          "protocols": "https",
          "regex_priority": 0,
          "strip_path": false
        }
      ],
      "plugins": {
        "name": "key-auth",
        "config": {
          "key_names": [
            "X-Client-Id"
          ],
          "run_on_preflight": false
        },
        "enabled": true
      }
    }
  ]
};
const genereratedDeckConf2 = {
  "_format_version": "1.1",
  "_info": {
    "select_tags": [
      "testapi"
    ]
  },
  "services": [
    {
      "name": "testapi",
      "host": "localhost",
      "port": "80",
      "protocol": "http",
      "read_timeout": 60000,
      "retries": 5,
      "routes": [
        { 
          "name": "testapi-route0",
          "paths": "/tax_calculator",
          "operation": [
            "post"
          ],
          "preserve_host": false,
          "protocols": "https",
          "regex_priority": 0,
          "strip_path": false
        },
        {
          "name": "testapi-route1",
          "paths": "/nontaxable_vehicle",
          "operation": [
            "post",
            "get"
          ],
          "preserve_host": false,
          "protocols": "https",
          "regex_priority": 0,
          "strip_path": false
        },
        {
          "name": "testapi-route2",
          "paths": "/nontaxable_vehicle/{id}",
          "operation": [
            "delete"
          ],
          "preserve_host": false,
          "protocols": "https",
          "regex_priority": 0,
          "strip_path": false
        }
      ],
      "plugins": {
        "name": "key-auth",
        "config": {
          "key_names": [
            "X-Client-Id"
          ],
          "run_on_preflight": false
        },
        "enabled": true
      }
    }
  ]
};

module.exports = {
  genereratedDeckConf,
  genereratedDeckConf2

}
