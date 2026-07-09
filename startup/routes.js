const user = require("../routes/user");
const auth = require('../routes/auth');
const express = require('express');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/user',user);
    app.use('/api/auth',auth);
    app.use(error);
}