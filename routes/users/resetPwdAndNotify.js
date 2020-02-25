const express = require("express");
const router = express.Router();
const _ = require("lodash");

const confirmEmail = require("../../utils/confirmEmail");

const sendEmailGeneric = require("../../utils/sendEmailGeneric");
const pwdHashed = require("../../utils/hash");
// const dbDebugger = require('debug')('app:db');
// const gravatar = require('gravatar');
const User = require("../../models/user");
// App level depndency imports
const validateRegisterInput = require("../../validation/users/validateRegisterInput");

// @route   POST router/users/resetPwdAndNotify
// @desc    Registration. Sends email confirmation notice.
// @access  Public
router.post("/", async (req, res) => {
  // console.log("req.body:", req.body);

  try {
    let checkEmailfilter = { email: req.body.email };
    let retUser = await User.find(checkEmailfilter);

    if (retUser.length === 1) {
      // console.log("retUser:", retUser);

      let rand = randomIntFromInterval(123456789, 987654321);
      let randpwd = rand.toString(16).toUpperCase();

      // console.log("randpwd:", randpwd);
      let hashedpwd = await pwdHashed(randpwd);
      // console.log("hashedpwd:", hashedpwd);

      let options = { new: true };

      let userUpdt = await User.findOneAndUpdate(
        checkEmailfilter,
        { password: hashedpwd },
        options
      );

      // console.log("userUpdt:", userUpdt);
      if (userUpdt.password) {
        console.log("successful with pwd=", randpwd, " hashed:", hashedpwd);
        // Send email with this password

        let pwdResetHtml =
          "Please use the following password to log in. <br/><br/>" +
          "<b>" +
          randpwd +
          "</b><br/><br/>" +
          "<font color='blue'><b>Note: </b> After you login, go to MyAccount in Navbar or side-drawer (for small devices like phones). <b>Click MyAccount -> Profile -> Password</b> to change your password. </font></br><br/> Thank you. <br/> <b>Baanda Robo-Admin</b>";

        emailData = {
          subject: "Pwd Reset from Baanda Robo-Admin",
          toEmail: req.body.email,
          body: pwdResetHtml
        };
        // console.log("Before  calling  sendInvoiceGeneric");

        let retEmail = await sendEmailGeneric(emailData);

        // console.log("retEmail:", retEmail);
        let msg =
          "Password is reset. Please check your email for login direction.";
        res.status(200).json({ status: "success", Msg: msg });
      } else {
        let msg = "Failed to reset password. Please contact Baanda support at jit@baanda.com";
        // console.log(msg);
        res.status(200).json({ status: "success", Msg: msg });
      }
      // Send email with this password
    } else {
      let msg = "No such email in Baanda registration.";
      res.status(200).json({ status: "error", Msg: msg });
    }
  } catch (err) {
    console.log("Error:", err.message);
    res
      .status(400)
      .json({
        status: "error",
        Msg: err.message + ". Please contact Baanda support at jit@baanda.com"
      });
  }

  // res.send("restPwdAndNotify");
});

module.exports = router;

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
