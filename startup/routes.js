/*
 ** Description: This module is responsible as a traffice controller of api routing
 ** Rivision Log:
 ** Author               Date        Description
 ** -----------------    ----------- -------------------------------------------------
 ** Jit (Sarbojit)       Jul 11, 19  Program initiated.
 **
 */
const express = require("express");

// const entryLogger = require("../middleware/logger");
const error = require('../middleware/error');
const register = require("../routes/users/register");
const login = require("../routes/users/login");
const verify = require("../routes/users/verify");
const dbtest = require('../routes/users/dbtest');
const resetPwdAndNotify = require('../routes/users/resetPwdAndNotify');

// MyAccount Related
const changePassword = require('../routes/myaccount/changePassword');
const getPriceOfService = require('../routes/myaccount/getPriceOfService');
const getProfile = require('../routes/myaccount/getProfile');

// Logger for database
const log = require('../routes/logs/log');


// Architecture & security
const getFunctionsOfRole = require('../routes/architecture/getFunctionsOfRole');

// API for testing features -- remove from production version
const testprocget = require('../routes/tests/testprocget');
const testpost = require('../routes/tests/testPost');

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));


  // Authenitcation, Registration Users 
  app.use("/routes/users/register", register);
  app.use("/routes/users/login", login);
  app.use("/routes/users/verify", verify);
  app.use('/routes/users/dbtest', dbtest);
  app.use('/routes/users/resetPwdAndNotify', resetPwdAndNotify);

  // MyAccount Related
  app.use('/routes/myaccount/changePassword', changePassword);
  app.use('/routes/myaccount/getProfile', getProfile);
  app.use('/routes/myaccount/getPriceOfService', getPriceOfService);

  
  
  // Archtecture & security
  app.use('/routes/architecture/getFunctionsOfRole', getFunctionsOfRole);


   // Log in server
   app.use('/routes/logs/log', log);
   

  // API for testing features -- remove  from production
  app.use('/routes/tests/testprocget', testprocget);
  app.use('/routes/tests/testPost', testpost);



  app.use(error);
  // let logMsg = { type: "server", domain: "start", msg: "Routers initiated" };
  // logger.info(JSON.stringify(logMsg));
};
