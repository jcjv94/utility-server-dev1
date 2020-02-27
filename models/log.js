/*
 **description: This is the initial schema for the logging system
 **
 ** initiation name: JC
 **
 **revision history:
 **   2/18/2019
 **
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const logSchema = new Schema({
    callingApp: {
        type: String,
        required: true
    },
    msgType: {
        type: String,
        enum: ['error', 'info', 'warning', 'debug'],
        required: true
    },
    errorId: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    },
    msg: {
        errorType: {
            type: String,
            enum: ['High-Priority', 'Priority', 'Important'],
            required: true
        },
        programName: String,
        method: String,
        errorMsg: String,
        inputData: { type: String, required: true }
    },

}, {
    timestamps: true

});



module.exports = mongoose.model('Log', logSchema);