const user = require("../routes/user");
const auth = require('../routes/auth');
const express = require('express');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/user',user);
    app.use('/api/auth',auth);
}