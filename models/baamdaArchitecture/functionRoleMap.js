const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const functionRoleMapSchema = new mongoose.Schema({
  intent: { type: String, required: true},
  focus: { type: String, required: true},
  role: { type: String, required: true},
  functionsAllowed: [],  // will be integer value of functionId
});

functionRoleMapSchema.index({ functionId: 1 }, { unique: true });

module.exports = FunctionRoleMap = mongoose.model(
  "functionRoleMap",
  functionRoleMapSchema
);