/*
 ** Description: This select and package data for expense budget distribution
 */

const FinancialSummary = require("../models/financialSummaryNow");
const BudgetDistribution = require("../models/budgetDistribution");

packageBudgetData = async communityId => {
  let returndata = {};
//   console.log("Inside packageBudgetData");
  try {
    let tcc = 0,
      tea = 0;
    let filter1 = { communityId: communityId };
    let finsum = await FinancialSummary.findOne(filter1).select("-_id totalCashInCoffer totalExpenseAllocation");
    if (finsum) {
      (tcc = finsum.totalCashInCoffer), (tea = finsum.totalExpenseAllocation);
    }

    let filter2 = { communityId: communityId, activeFlag: true };
    // console.log('filter2:', filter2);
    let bdist = [];
    let budgetObj = {};
    let bgtdist = await BudgetDistribution.find(filter2).exec();
    // console.log('bgtdist:', bgtdist, ' length:', bgtdist.length);
    // .exec();
    if (bgtdist.length > 0) {
      bgtdist.forEach(element => {
        budgetObj = {
          budgetId: element.budgetId,
          categoryName: element.categoryName,
          allocatedAmount: element.allocatedAmount,
          spentAmount: element.spentAmount,
          note: element.note
        };
        bdist.push(budgetObj);
      });
    }

    let retMsg = {
      totalCashInCoffer: tcc,
      totalExpenseAllocation: tea,
      budgetDistribution: bdist
    };
    returndata = { status: "success", Msg: retMsg };
  } catch (err) {
    console.log("Error: " + err);
    returndata = { statue: "error", Msg: err.message };
  }

  return returndata;
};

module.exports = packageBudgetData;
