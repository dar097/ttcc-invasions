var mongoose = require('mongoose');

var HistorySchema = new mongoose.Schema({
    started_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvasionLogs'
    },
    ended_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvasionLogs'
    },
    started: Date,
    ended: Date
});

module.exports = mongoose.model('InvasionHistory', HistorySchema);