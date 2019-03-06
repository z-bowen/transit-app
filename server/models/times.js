var mongoose = require('mongoose');

var TimesSchema = new mongoose.Schema({
    line_id: {
        type: Number
    },
    stop_id: {
        type: Number
    },
    time: {
        type: Date
    }
});

var Times = mongoose.model('Time', TimesSchema);

module.exports = {Times};
