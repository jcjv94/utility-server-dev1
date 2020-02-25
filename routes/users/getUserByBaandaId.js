/*
 ** Description: Get user data via baandaId
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const User = require('../../models/user');

// @route   GET /routes/dashboard/getUserByBaandaId
// @desc    Checks if a item exists for validation.
// @access  public
router.get("/", async (req, res) => {
    dbDebugger('Req.query:', req.query)
    try {
        let filter = { baandaId: req.query.baandaId}
        let ret = await User.find( filter );
        dbDebugger('ret:', ret);
        res.status(200).send({status: 'Success', Msg: ret});
    } catch (err) {
        dbDebugger('Err:' , err.message);
        res.status(400).json({status: 'Error', Msg: err.message});
    }
    
});

module.exports = router;