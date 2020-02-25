const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const servicePricingSchema = new mongoose.Schema({
  serviceId: {
      type: Number,
      required: true
  },
  serviceName: {
      type: String,
      required: true
  },
  focus: {
      type: String,
      default: ''   // it is blank for general or flat charges like %of financial transaction
  },
  intent: {
      type: String,
      default: ''
  },
  chargeType: {
      type: String,
      enum: [ 'percentage', 'flatfee' ],
      default: 'flatfee'
  },
  creditsCharged: {
      type: Number,
      default: 0
  },
  updated_by_bid: {
    type: Number,
    required: true
  }
});


servicePricingSchema.index({ serviceId: 1 }, { unique: false });

module.exports = ServicePricing = mongoose.model("servicePricing", servicePricingSchema);