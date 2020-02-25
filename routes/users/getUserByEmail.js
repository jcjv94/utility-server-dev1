/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const User = require('../../models/user');

// @route   GET /routes/dashboard/getUserByEmail
// @desc    Checks if a item exists for validation.
// @access  public
router.get("/", async (req, res) => {
    dbDebugger('Req.query:', req.query)
    try {
        let filter = { email: req.query.email}
        let ret = await User.findOne( filter ).select('-_id baandaId profileInfo')
        dbDebugger('ret:', ret);
        res.status(200).send({status: 'Success', Msg: ret});
    } catch (err) {
        dbDebugger('Err:' , err.message);
        res.status(400).json({status: 'Error', Msg: err.message});
    }
    
});

module.exports = router;