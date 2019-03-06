const {ObjectID} = require('mongodb');
const {setDate} = require('../../utils/utils');

const {Delays} = require('../../models/delays')
const {Lines} = require('../../models/lines')
const {Stops} = require('../../models/stops')
const {Times} = require('../../models/times')

const delays = [{
    _id: new ObjectID,
    line_name: 'X1',
    delay: '1'
}];

const lines = [{
    _id: new ObjectID,
    line_name: 'X1',
    line_id: '1'
}, {
    _id: new ObjectID,
    line_name: 'X2',
    line_id: '2'
}]

const stops = [{
    _id: new ObjectID,
    stop_id: 1,
    x: 1,
    y: 1
},{
    _id: new ObjectID,
    stop_id: 2,
    x: 2,
    y: 2
}];

const times = [{
    _id: new ObjectID,
    line_id: 1,
    stop_id: 1,
    time: setDate('23:59:59')
},{
    _id: new ObjectID,
    line_id: 1,
    stop_id: 2,
    time: setDate('00:00:01')
}]

const populateDelays = (done) => {
    Delays.deleteMany({}).then(() => {
      return Delays.insertMany(delays);
    }).then(() => done());
};

const populateLines = (done) => {
    Lines.deleteMany({}).then(() => {
      return Lines.insertMany(lines);
    }).then(() => done());
};

const populateStops = (done) => {
    Stops.deleteMany({}).then(() => {
      return Stops.insertMany(stops);
    }).then(() => done());
};

const populateTimes = (done) => {
    Times.deleteMany({}).then(() => {
      return Times.insertMany(times);
    }).then(() => done());
};

module.exports = {delays, lines, stops, times, populateDelays, populateLines, populateStops, populateTimes}