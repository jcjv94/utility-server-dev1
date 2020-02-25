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
const AccessList = require('../../models/accessList');
const Community = require('../../models/community');

// @route   POST /routes/users/saveRoleAssignment
// @desc    Updates the persona score and inserts OCEAN.
// @access  Private (should be private - check via jwt via middleware when get time)
router.post("/", async (req, res) => {
  dbDebugger(">>> req.body:", req.body);
  try {
      let filter = { communityId: req.body.communityId }
      let comm = await Community.findOne(filter).select('-_id commName commCaption intent intentFocus');
      dbDebugger('comm:', comm);

      let accessFilter = { baandaId: req.body.assigneeBid, communityId: req.body.communityId}
      update = {
          baandaId: req.body.assigneeBid,  
          communityId: req.body.communityId,
          commName: comm.commName,
          commCaption: comm.commCaption,
          intent: comm.intent,
          intentFocus: comm.intentFocus,
          role: req.body.role,
          updated_at: Date.now(),
          updated_by_bid: req.body.assignorBid
      }
      options = { upsert: true, new: true, setDefaultsOnInsert: true};
      let acl = await AccessList.findOneAndUpdate( accessFilter, update, options);
      dbDebugger('#@$@# #@$#@$');
      dbDebugger('acl:', acl);

      // Push 
      let memberOf = {
          communityId: req.body.communityId,
          groupId: 0,
          role: req.body.role
      }

      let memofFilter = { baandaId: req.body.assigneeBid, "memberOf.communityId": req.body.communityId }
      await User.findOneAndUpdate( memofFilter, 
        { $set: { memberOf: memberOf }}, options);
      dbDebugger('Done ...'); 
      res.status(200).json({ status: 'success', Msg: ''});  

  } catch(err) {
      dbDebugger('err:', err.message);
      res.status(400).json({ status: 'error', Msg: err.message});
  }
//   res.send('saveRoleAssignment');
});

module.exports = router;