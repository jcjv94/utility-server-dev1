/*
 ** Description: Checks to see if a baandaid+commName exists
 */
const express = require("express");
const router = express.Router();

const dbDebugger = require("debug")("app:db");

// DB Schemas

const Group = require("../../models/group");

const useCreditDbUpdates = require("../../utils/baandaAccounting/useCreditDbUpdates");

// @route   GET /routes/tests/testprocget
// @desc    Checks if a item exists for validation.
// @access  public
router.get("/", async (req, res) => {
  console.log("req.body:", req.query);

  try {
    let data = {
      baandaId: 1000000000,
      credits: 5,
      communityId: 130,
      serviceId: 1,
      note: 'Credits used for creating the new community',
      callingFunction: 'serviceRenderedCash'
    };

    let ret = await useCreditDbUpdates(data);
    console.log('ret:', ret);

    res.status(200).json({ msg: "testprocget" });
  } catch (err) {
    console.log("err:", err.message);
    res.status(400).json({ status: "Error", Msg: err.message });
  }
  //    res.send('testprocget')
});

module.exports = router;
// module.exports = router;
