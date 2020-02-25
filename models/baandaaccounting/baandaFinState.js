const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const baandaFinStateSchema = new mongoose.Schema({
  ref: { type: String, default: 'baandaFinState'},
  creditLiability: { type: Number, default: 0},       // Credits purchased by user or given but not yet used
  revenueInCredits: { type: Number, default: 0},      // Credits used and hence Baanda revenue
  internalInvestment: { type: Number, default: 0},    // Investment made by Baanda board and internal stock holders 
  externalInvestment: { type: Number, default: 0},    // Investment made by external people to Baanda  
  
  updated_at: { type: Date, default: Date.now },
});

module.exports = BaandaFinState = mongoose.model(
  "baandaFinState",
  baandaFinStateSchema
);