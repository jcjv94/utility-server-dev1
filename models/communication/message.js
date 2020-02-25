const mongoose = require("mongoose");

// comm is attached in front to distinguish with other names in other schemas in programs.
const messageSchema = new mongoose.Schema({
  baandaId: {
    type: Number,
    required: true
  },
  communityId: {
    type: Number,
    required: true
  },
  inviteeEmail: {
      type: String,
      default: ''
  },
  messageId: {
    type: Number,
    required: true
  }, 
  poolId: {
    type: Number,
    required: true
  },
  whoAmITag: {
      type: String,
      required: true,
      enum: [ 'sender', 'receiver']
  },
  status: {
      type: String,
      required: true,
      default: 'new',
      enum: [ 'new', 'opened', 'replied', 'accepted', 'declined']
  },
  msgType: {
      type: String,
      required: true,
      default: '',
      enum: [ '', 'invite', 'message', 'opportunity']
  },
  subject: {
      type: String,
      default: ''
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  updated_by_bid: {
    type: Number,
    required: true
  }
});

messageSchema.index({ baandaId: 1,  messageId: 1 }, { unique: true });

module.exports = Message = mongoose.model("message", messageSchema);