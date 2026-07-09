const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const Debugger = require('debug')('app:startup'); //$env:DEBUG="app:startup"
const Joi = require('joi');
Joi.objectId =require('joi-objectid')(Joi);

require('dotenv').config();
require('./startup/db')();
require("./startup/config")();

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    Debugger('Morgan Enabled');
}
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', ' http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./startup/routes')(app);

const PORT = process.env.PORT || 9000;
app.listen(PORT,  () =>{ 
    console.log(`Example app listening on port ${PORT}!`)   // number the env 
});