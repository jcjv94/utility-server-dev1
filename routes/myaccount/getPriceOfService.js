/*
 ** Description: Checks the price of a service in baanda credits
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas
const GetPriceOfService = require('../../models/baandaaccounting/servicePricing');
// @route   GET /routes/myaccount/getPriceOfService
// @desc    get pricing info of a baanda service.
// @access  public
router.get("/", async (req, res) => {
    console.log('Req.query:', req.query)
    try {
        let filter = { serviceName: req.query.serviceName }

        let ret = await GetPriceOfService.findOne(filter);
        console.log('ret:', ret);
        res.status(200).send({status: 'Success', Msg: ret});
    } catch (err) {
        console.log('Err:' , err.message);
        res.status(400).json({status: 'Error', Msg: err.message});
    }
    // res.send('getPriceOfService');
});

module.exports = router;