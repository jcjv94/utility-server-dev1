/*
 ** Description: This is to log errors
 */
const express = require("express");
const router = express.Router();

const allBaandaId = require("../../models/allBaandaID");
const Log = require('../../models/log');

// @route   POST /routes/logs/log
// @desc    Saves an error from an application
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  console.log("req.body:", req.body);

  try {
    let neweid = await allBaandaId.findOneAndUpdate(
      { ref: "error-id" },
      {
        $inc: {
          newbaandadomainid: 1
        }
      },
      // opts
    );

  //   let typeOfMsg = ({
  //     error: req.body.error,
  //     info: req.body.info,
  //     warning: req.body.warning,
  //     debug: req.body.debug
  // });

  // let message = ({
  //     highPriority: req.body.highPriority,
  //     priority: req.body.priority,
  //     important: req.body.important,

  // });

  let msg = {
    errorType: req.body.priority,
    programName: req.body.progName,
    method: req.body.method,
    errorMsg: req.body.errorMsg,
    inputData: req.body.progInput
  }

  let log = new Log({
      callingApp: req.body.callingApp,
      msgType: req.body.msgType,
      errorId: neweid.newbaandadomainid,
      time: Date.now(),
      msg: msg,
  });
  
  // save the document
  let ret = await log.save();
  console.log('ret:', ret);
  // console.log("neweid:", neweid);
    // console.log("just id:", neweid.newbaandadomainid);

    res.status(200).json({ status: 'success', Msg: { errorid: neweid.newbaandadomainid}})
  } catch (err) {
    console.log("err:", err.message);
    res.status(400).json({ status: 'error', Msg: err.message })
  }

  // res.send("in log.js");
});

module.exports = router;
