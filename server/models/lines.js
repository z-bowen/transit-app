var mongoose = require('mongoose');

var LinesSchema = new mongoose.Schema({
    line_id: {
        type: Number
    },
    line_name: {
        type: String
    } 
  });

const Lines = mongoose.model('Line', LinesSchema);

module.exports = {Lines};