const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const dashboardFunctionSchema = new mongoose.Schema({
  functionId: { type: Number, required: true},  
  intent: { type: String, required: true},
  focus: { type: String, required: true},
  functionNme: { type: String, required: true},
  level: { type: Number, required: true},
  lastUpdatedAt: { type: Date, default: Date.now },
});

dashboardFunctionSchema.index({ functionId: 1 }, { unique: true });

module.exports = DashboardFunction = mongoose.model(
  "dashboardFunction",
  dashboardFunctionSchema
);