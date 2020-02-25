const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const journalSchema = new mongoose.Schema({
  communityId: { type: Number, required: true}, 
  journalId: { type: Number, required: true},
  debitAccountName: { type: String, required: true},   
  creditAccountName: { type: String, required: true},
  Amount: { type: String, required: true},
  referenceDocType: { type: String, required: true},
  referenceIdType: { type: String, required: true},
  referenceId: { type: Number, required: true},
    
  entry_at: { type: Date, default: Date.now },
  entered_by_bid: {
    type: Number,
    required: true
  }
});

journalSchema.index({ journalId: 1 }, { unique: true });
// customerSchema.index({ email: 1, customerBaandaId: 1 }, { unique: false });

module.exports = JournalSchema = mongoose.model("journal", journalSchema);