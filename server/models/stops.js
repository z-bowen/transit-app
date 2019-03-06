var mongoose = require('mongoose');

var StopsSchema = new mongoose.Schema({
    stop_id: {
        type: Number
    },
    x: {
        type: Number
    },
    y: {
        type: Number
    }
});

var Stops = mongoose.model('Stop', StopsSchema);

module.exports = {Stops};