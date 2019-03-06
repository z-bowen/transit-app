var mongoose = require('mongoose')
var {Delays} = require('../models/delays')
var {Lines} = require('../models/lines')
var {Stops} = require('../models/stops')
var {Times} = require('../models/times')

const port = process.env.DB_PORT || 27017;
const connectionURL = 'mongodb://127.0.0.1:${port}/transit-data';

conn = mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true
})

// drop the data from the previous execution
// we do this to make sure the correct test data is always loaded when we start the server

var dropDelays = Delays.deleteMany({});
var dropLines = Lines.deleteMany({});
var dropStops = Stops.deleteMany({});
var dropTimes = Times.deleteMany({});

// load the test data into the db once we've dropped the previous collections

Promise.all([dropDelays, dropLines, dropStops, dropTimes]).then(() => {

    var data = require('./data/data');

    const d = data.load();

    d.then((res) => {
        Delays.insertMany(res.delays);
        Lines.insertMany(res.lines);
        Stops.insertMany(res.stops);
        Times.insertMany(res.times);
    }, (err) => {
        console.log(err)
    });
    
})

module.exports = {mongoose};