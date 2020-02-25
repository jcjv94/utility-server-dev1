const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const messagePoolSchema = new mongoose.Schema({
  poolId: {
    type: Number,
    required: true
  },
  poolPeople: [
    {
      BaandaId: {
        type: Number,
        required: true
      }
    }
  ],
  poolContent: [
    {
      msgType: {
        type: String,
        default: "text",
        enum: ["text", "audio", "video", "pdf", "pic"]
      },
      theText: {
        type: String,
        default: ""
      },
      theUrl: {
        s3Url: { type: String, default: "" },
        key: { type: String, default: "" }
      },
      actionType: {
        type: String,
        default: "message",
        enum: ["message", "email", "text", "meeting"]
      },
      msgSendDate: { type: Date, default: Date.now },
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

messagePoolSchema.index({ poolId: 1 }, { unique: true });

module.exports = MessagePool = mongoose.model("messagepool", messagePoolSchema);
