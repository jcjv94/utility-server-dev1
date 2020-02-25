const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const baandaPaymentLogSchema = new mongoose.Schema({
  payLogId: {
    type: Number,
    required: true
  },
  communityId: {
    type: Number,
    required: true
  },
  baandaId: {
    type: Number,
    required: true
  },
  serviceId: {
    type: Number,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  logDate: {
    type: Date,
    default: Date.now
  }
});

baandaPaymentLogSchema.index({ payLogId: 1 }, { unique: true });

module.exports = BaandaPaymentLog = mongoose.model(
  "baandaPaymentLog",
  baandaPaymentLogSchema
);
