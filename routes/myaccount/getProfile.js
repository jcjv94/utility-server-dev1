/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const User = require('../../models/user');

// @route   GET /routes/myaccount/getProfile
// @desc    Checks if a item exists for validation.
// @access  public
router.get("/", async (req, res) => {
    // console.log('Req.query:', req.query)
    try {
        let filter = { email: req.query.email}
        // console.log('filter:', filter);
        let ret = await User.findOne(filter).select('-_id profileInfo');
        // console.log('ret:', ret);
        // let xx = JSON.parse(ret);
        // console.log('ret:', ret.profileInfo.formalName);
        res.status(200).send({status: 'Success', Msg: ret.profileInfo});
    } catch (err) {
        console.log('Err:' , err.message);
        res.status(400).json({status: 'Error', Msg: err.message});
    }

    // res.send('getProfile');
});

module.exports = router;