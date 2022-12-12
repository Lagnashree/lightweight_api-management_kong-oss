const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const bodyParser = require("body-parser");
dotenv.config({ path: path.join(__dirname, '../') + '.env' });
const logger = require('./src/config/winston').logger;
const morgan = require('morgan');

app.use(morgan("combined", { "stream": logger.stream }));

app.use(express.json());
app.use(bodyParser.json());


app.use('/api/v1/catalog-service/api', require('./src/controller/crudController'));

app.use((req, res) => {
    logger.log("info","endpoint with no matching route called");
    res.status(404).send('No route found');
});
app.use((err, req, res) => {
    console.error(err);
    logger.log("error","error while processing request",err);
    res.status(500).send(err.response || 'Something broke!');
});
const server = app.listen(8080, function () {
    const port = server.address().port;
    console.log("Microservice is running at port:" + port);
});
