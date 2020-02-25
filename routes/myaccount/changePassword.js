const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs"); // For encrypting password

const sendEmailGeneric = require("../../utils/sendEmailGeneric");
const pwdHashed = require("../../utils/hash");
// const dbDebugger = require('debug')('app:db');
// const gravatar = require('gravatar');
const User = require("../../models/user");
// App level depndency imports

// @route   POST router/users/changePassword
// @desc    Registration. Sends email confirmation notice.
// @access  Public
router.post("/", async (req, res) => {
//   console.log("req.body:", req.body);

  try {
    let hashedpwd = await pwdHashed(req.body.currentPwd);
   //  console.log(
   //    "req.body.currentPwd:",
   //    req.body.currentPwd,
   //    " hashedpwd:",
   //    hashedpwd
   //  );
    let checkEmailfilter = { email: req.body.email };
    let user = await User.findOne(checkEmailfilter);

    let compare = await bcrypt.compare(req.body.currentPwd, user.password);

    if (compare) {
      // console.log("Valid pwd");
      let hashedpwd = await pwdHashed(req.body.newPwd);
      let options = { new: true };

      // console.log('req.body.newPwd:', req.body.newPwd, " hashedpwd:", hashedpwd);
      let userUpdt = await User.findOneAndUpdate(
        checkEmailfilter,
        { password: hashedpwd },
        options
      );

      // console.log('>> userUpdt:', userUpdt);

      let pwdResetHtml =
        "<font color='red'>Your password has been changed .</font> <br/><br/>" +
        "<b>" + 
        "<font color='blue'><b>Note: </b> Please notify Baanda at jit@baanda.com if you are unaware of the change immediately. You can text to 310 422 7910 with word 'I did not change my password' followed by your email address. If you have changed your password, disregard this email.</font></br><br/> Thank you. <br/> <b>Baanda Robo-Admin</b>";

      emailData = {
        subject: "Your password has been changed",
        toEmail: req.body.email,
        body: pwdResetHtml
      };
      // console.log("Before  calling  sendInvoiceGeneric");
      // console.log('emailData:', emailData);

      let retEmail = await sendEmailGeneric(emailData);

      // console.log('retEmail:', retEmail);

      res.status(200).json({ status: "success", Msg: "" });
    } else {
      // console.log("Invalid pwd");
      res
        .status(200)
        .json({ status: "error", Msg: "Invalid current password." });
    }
    // let retUser = await User.find(checkEmailfilter).select("-_id password");
    // console.log("hashedpwd:", hashedpwd, ' retUser:', retUser[0].password);
  } catch (err) {
   //  console.log("----------->>> Err:", err.message);
    res.status(400).json({ status: "error", Msg: err.message });
  }

  // res.send('changePassword');
});

module.exports = router;
