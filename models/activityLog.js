const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const activityLogSchema = new mongoose.Schema({
  // activityId: { type: Number, required: truw},
  communityId: { type: Number, default: 0}, 
  activityType: { type: String, required: true },
  activity: { type: Object, default: null },  
  created_at: { type: Date, default: Date.now },
  updated_by_bid: {
    type: Number,
    required: true
  }
});


activityLogSchema.index({ communityId: 1 }, { unique: false });

module.exports = ActivityLog = mongoose.model("activitylog", activityLogSchema);