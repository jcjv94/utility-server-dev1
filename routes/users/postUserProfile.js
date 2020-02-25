/*
 ** Description: Post user's profile (init and/or edited versions)
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");
// const logger = require("../../utils/loggerSetup");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// DB Schemas
const User = require("../../models/user");

// @route   POST /routes/users/postUserProfile
// @desc    Updates the persona score and inserts OCEAN.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  // console.log("req.body:", req.body);
  let geoInfo = JSON.stringify(req.body.profile.locationCurr);

  let proInfo = { 
    cell: {
      number: req.body.profile.cell
    },
    preferredName: req.body.profile.preferredName,
    formalName: req.body.profile.formalName,
    selfDescription: req.body.profile.selfDescription,
    preferredPronoun: req.body.profile.preferredPronoun,
    geoLocation: req.body.profile.geoLocation,
    geoCentricInfo: geoInfo,
    fileUploads: req.body.profile.fileUpload,
    address: req.body.profile.address
  };

  // console.log('%%%%%%%%%%%%% proInfo:', proInfo);
  try {
    // let user = await User.findOne({ baandaId: req.body.baandaid });
    let user = await User.findOneAndUpdate(
      { baandaId: req.body.baandaid },
      {
        $set: {
          profileInfo: proInfo,
          isInitProfileDone: true
        }
      },
      { new: true }
    );
    // console.log("user:", user);

    payload = {
      baandaId: user.baandaId,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      isInitDone: user.isInitDone,
      isInitProfileDone: user.isInitProfileDone
    };
    let token = await jwt.sign(payload, keys.secretOrKey);
    dbDebugger("token:", token);
    // , (err, token) => {
    res.status(200).json({ success: true, token: "Bearer " + token });
    //   });
    // res.status(200).json(user);
  } catch (err) {
    dbDebugger("profile post error:", err);
    res.status(400).json(err);
  }
});

module.exports = router;
