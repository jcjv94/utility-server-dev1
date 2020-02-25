// Update all necessary db for use of credits for baanda service.
// Instances:
// 1. Use credits for Publishing of a new community.

const mongoose = require("mongoose");

const JournalEntry = require('../journalEntry');
const moment = require('moment');

// DB Schemas
// const Journal = require("../../models/journal");
// const JournalAccountPair = require("../../models/journalAccountPair");
const AllBaandaId = require("../../models/allBaandaID");
// const moment = require("moment");

const User = require("../../models/user");
// const ServicePricing = require("../../models/baandaaccounting/servicePricing");
const BaandaPaymentsLog = require("../../models/baandaaccounting/baandaPaymentsLog");
const BaandaFinState = require("../../models/baandaaccounting/baandaFinState");

useCreditDbUpdates = async inpData => {
  // console.log("useCreditDbUpdates inpdata:", inpData);

  let retMessage;

  const session = await mongoose.startSession();
  session.startTransaction();
  const opts = { session };
  try {
    // 1. Decrease User's availableCredits by credits spent
    await User.findOneAndUpdate(
      { baandaId: inpData.baandaId },
      {
        $inc: {
          availableCredits: inpData.credits * -1
        }
      },
      opts
    );

    // 2. Insert a document into baandaPaymentsLog
    let newPaylogId = await AllBaandaId.findOneAndUpdate(
      { ref: "paylog-id" },
      {
        $inc: {
          newbaandadomainid: 1
        }
      },
      opts
    );
    // console.log(
    //   "newPaylogId:",
    //   newPaylogId,
    //   " paylogId:",
    //   newPaylogId.newbaandadomainid
    // );
    let baandaPaymentsLog = new BaandaPaymentsLog({
        payLogId: newPaylogId.newbaandadomainid,
        communityId: inpData.communityId,
        baandaId: inpData.baandaId,
        serviceId: inpData.serviceId,
        credits: inpData.credits,
        note: inpData.note
    });
    await baandaPaymentsLog.save(opts);

    let journalData = {
        communityId: inpData.communityId,
        amount: inpData.credits,
        callingFunction: inpData.callingFunction,
        referenceId: newPaylogId.newbaandadomainid,
        entry_at: moment(),
        baandaId: inpData.baandaId
    }

    // console.log('1. journalData:', journalData);

    let je = await JournalEntry(journalData);
    if ( je.status === 'error') {
        throw new  Error(`Journal Entry failed for journal Data = ${journalData}`);
    }

    // Update (increment) the revenueInCredits 
    let finStateFilter = { ref: 'baandaFinState'};
    let finupdate = { $inc: { revenueInCredits: inpData.credits }};
    let updtfin = await BaandaFinState.findOneAndUpdate( finStateFilter, finupdate, opts );
    // console.log('>>> updtfin:', updtfin);

    await session.commitTransaction();
    retMessage = 'success';

  } catch (err) {
    console.log("BCDU Err:", err.message);
    await session.abortTransaction();
    retMessage = "error: " + err.message;
  } finally {
    session.endSession();
  }

  return retMessage;
};

module.exports = useCreditDbUpdates;
