/*
 ** Description: Create test data for financial summary. This will be complete at the 
 ** end of whole financial system. But, data will be needed to test, check other systems.
 ** During development only.
 */

const FinancialSummary = require("../models/financialSummaryNow");

testFinDataCreation = async (cid) => {

  console.log("Inside testFinDataCreation");
  try {
    let fsn = new FinancialSummary({
        communityId: cid,
        totalCashInCoffer: 2000.00,
        totalExpenseAllocation: 1000.00,
        totalLiability: 0,
        totalReceivable: 0,
        totalEquity: 0,
        totalAsset: 0,
        updated_at: Date(),
        updated_by_bid: 123456789
    })

    let ret = await fsn.save();
    console.log('ret: ', ret); 

  } catch (err) {
    console.log("Error: " + err);
  }

  return returndata;
};

module.exports = testFinDataCreation;