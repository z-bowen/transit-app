var mongoose = require('mongoose');

var DelaysSchema = new mongoose.Schema({
    line_name: {
        type: String
    },
    delay: {
        type: Number
    }  
});

var Delays = mongoose.model('Delay', DelaysSchema);

module.exports = {Delays};