// enter general ledger journal for all financial  transactions.

// DB Schemas
const Journal = require("../models/journal");
const JournalAccountPair = require("../models/journalAccountPair");
const AllBaandaId = require("../models/allBaandaID");
const moment = require('moment');

journalEntry = async data => { 
  // console.log("journalEntry data:", data);

  try {
    let filterj = { functionType: data.callingFunction };
    // console.log('++++++++++++++  filterj:', filterj);
    let acpairs = await JournalAccountPair.findOne(filterj);
    // console.log('++++++++++++++ acpairs: ', acpairs);
    
    let journalId = await AllBaandaId.findOneAndUpdate(
      {
        ref: "journal-id"
      },
      {
        $inc: {
          newbaandadomainid: 1
        }
      }
    );

    // console.log('new journalId:', journalId.newbaandadomainid);

    let journal = new Journal({
      communityId: data.communityId,
      journalId: journalId.newbaandadomainid,
      debitAccountName: acpairs.debitAccountName,
      creditAccountName: acpairs.creditAccountName,
      Amount: data.amount,
      referenceDocType: data.callingFunction,
      referenceIdType: acpairs.referenceIdName,
      referenceId: data.referenceId,
      entry_at: moment(),
      entered_by_bid: data.baandaId
    });

    // console.log('journal :', journal);

    await journal.save();
  
    return { status: 'success', Msg: "" };
  } catch (err) {
    console.log("Error:", err.message);
    return { status: 'error' , Msg: err.message };
  }
};

module.exports = journalEntry;
