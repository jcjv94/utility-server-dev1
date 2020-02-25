const express = require("express");
const router = express.Router();
const _ = require("lodash");


const confirmEmail = require("../../utils/confirmEmail");
const pwdHashed = require("../../utils/hash");
const dbDebugger = require("debug")("app:db");
const gravatar = require("gravatar");

const User = require("../../models/user");
const AllBaandaId = require("../../models/allBaandaID");
const Message = require('../../models/communication/message');

const keys = require("../../config/keys");

// App level depndency imports
const validateRegisterInput = require("../../validation/users/validateRegisterInput");

// @route   POST router/users/register
// @desc    Registration. Sends email confirmation notice.
// @access  Public
router.post("/", async (req, res) => {
  dbDebugger('Register req.body:', req.body);
  // Send req.body.opstype FROM THE CLIENT REGISTER.js
  // Validate
  let confirmationCode;
  let { errors, isValid } = validateRegisterInput(req.body);
  dbDebugger('errors:', errors, ' isValid:', isValid);

  if (!isValid) {
    // 400 is Invalid Request
    res.status(400).json(errors);
    return;
  }
  try {
    dbDebugger('I am here 1');
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      errors.email = "Email already exist. Please log in.";
      // throw new Error(errors)
      return res.status(400).json(errors);
    }
    const avatargen = gravatar.url(req.body.email, {
      s: "200", //size
      r: "pg", // Rating ..
      d: "mm" // Defaults to empty face icon
    });
    // Set up email confirmation parameters
    let hashedpwd = await pwdHashed(req.body.password);
    dbDebugger('I am here 2');
    let restSave;
    // =========== If regular REGISTRATION
    dbDebugger('req.body.opstype:', req.body.opstype)
    if (req.body.opstype === "new") {
      dbDebugger('Inside new');
      confirmationCode = Math.floor(Math.random() * 10000000);
      let date = new Date();
      let confirmBy = date.setDate(date.getDate() + 10);
      // Hash password using utility pwdHashed
      // let hashedpwd = await pwdHashed(req.body.password);

      let usernew = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatargen,
        password: hashedpwd,
        confirmCode: confirmationCode,
        confirmBy: confirmBy,
        created_at: Date.now()
      });
      retSave = await usernew.save();
      dbDebugger('retSave: ', retSave.baandaId);
      // ============ if invitee Registration
    } else {
      dbDebugger('Inside invite');
      let baandaId = await AllBaandaId.findOneAndUpdate(
        { ref: "baanda-id-ref" },
        { $inc: { newbaandadomainid: 1 }}
      );  // create session if works from Heroku
      // dbDebugger('new bid:', baandaId.newbaandadomainid);

      let userinvited = new User({
        baandaId: baandaId.newbaandadomainid,
        name: req.body.name,
        email: req.body.email,
        avatar: avatargen,
        password: hashedpwd,
        confirmCode: 0,
        confirmBy: Date.now(),
        created_at: Date.now(),
        isConfirmed: true,
        isActive: true
      });
      // dbDebugger('before save >> user:', userinvited);

      retSave = await userinvited.save();  // create session

      dbDebugger('--------------------------------');

      // CREATE A Message doc for this user before redirecting to login page
      // Copy from welcomeNewMember.js ...
      // DO NOT NEED THIS FOR INVITE ... pool is for actual messages.
      let messageId = await AllBaandaId.findOneAndUpdate(
        { ref: "transaction-id" },
        { $inc: { newbaandadomainid: 1 } }
      );

      let message = new Message({
        baandaId: baandaId.newbaandadomainid,
        communityId: req.body.communityId,
        inviteeEmail: req.body.inviteEmail,
        messageId: messageId.newbaandadomainid,
        poolId: 0,
        whoAmITag: "receiver",
        status: "new",
        msgType: "invite",
        subject: req.body.subject,
        updated_by_bid: baandaId.newbaandadomainid
      });
      dbDebugger('message:', message);

      let msgRec = await message.save();
      dbDebugger('msgRec:', msgRec);
    }

    
    dbDebugger("Post registration save state:" , retSave.baandaId);
    // send email for verification

    dbDebugger('>>>>>>>>>  req.body.opstype:', req.body.opstype);
    
    if (req.body.opstype === "new") {
      dbDebugger('>>>>> inside new confirmemail ... confirmationCode:', confirmationCode );
      let retEmail = confirmEmail(req, confirmationCode);
      if (retEmail) {
        res.status(200).json({
          message:
            "Registered successfully. Please confirm your email to login."
        });
      } else {
        res.status(500).json(errors);
      }
    } else {
        // res.redirect(redir);
      res.status(200).json({message: "Registered succesfully. Please login."})
    }
    // res.status(200).send(_.pick(user, ['name', 'email', 'avatar']));
  } catch (err) {
    dbDebugger("Failed to create new user :", err.message);
    res.status(401).json(err.message)
  }
});

module.exports = router;
