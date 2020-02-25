const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const journalAccountPairSchema = new mongoose.Schema({
  
  functionType: { type: String, required: true},
  debitAccountName: { type: String, required: true},   
  creditAccountName: { type: String, required: true},
  referenceIdName: { type: String,  required: true}
});

journalAccountPairSchema.index({ functionType: 1 }, { unique: true });
// customerSchema.index({ email: 1, customerBaandaId: 1 }, { unique: false });

module.exports = JournalAccountPairSchema = mongoose.model("journalAccountPair", journalAccountPairSchema);