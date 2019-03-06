const express = require('express')
const {setDate, getTime, messages} = require('./utils/utils');
// const getTime = require('./utils/utils').getTime;
var dateFormat = require('dateformat')

var {mongoose} = require('./db/mongoose')
var {Delays} = require('./models/delays');
var {Lines} = require('./models/lines');
var {Stops} = require('./models/stops');
var {Times} = require('./models/times');

const port = process.env.PORT || 8081;
var app = express();

/**
 * Return any delays on the given line
 * @return {Object}     {line_name, delay}
 */
app.get('/delays/:line', async (req, res) => {
    try {
        var line = req.params.line;
        const isLine = await Lines.findOne({
            line_name: line
        });
        if (!isLine) {
            return res.status(404).json({message: messages.lineNotFound(line) }).send();
        }
        const delay = await Delays.findOne({
            line_name: line,
            delay: { "$gt": 0 }
        });
        if (delay) {
            return res.send({
                line_name: delay.line_name,
                delay: delay.delay
            })
        }
        return res.send({
            line_name: line,
            delay: 0
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

/**
 * Find a vehicle matching the time and location
 * @return {Object}     {line_id, stop_id, time}
 */
app.get('/times', async (req, res) => {
    try {
        var params = req.query;
        const time = setDate(params.time);
        const x = params.x;
        const y = params.y;
        if (!time || !x || !y) {
            return res.status(404).json({message: messages.missingParameter('{time, x, y}')}).send();
        }
        const stop = await Stops.findOne({x, y});
        if (!stop) {
            return res.status(404).json({message: messages.stopNotFound(x, y)}).send();
        }        
        const stop_id = stop.stop_id;
        const vehicle = await Times.findOne({stop_id, time});
        if (!vehicle) {
            return res.status(404).json({message: messages.noVehicleAtStopAtTime(stop_id, getTime(time))}).send()
        }
        res.send({
            line_id: vehicle.line_id,
            stop_id: vehicle.stop_id,
            time: getTime(vehicle.time)
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

/**
 * Find the next vehicle arriving at the stop
 * @return {Object}     {line_id, stop_id, time}
 */
app.get('/stops/:stop_id', async (req, res) => {
    try {
        var stop_id = req.params.stop_id;
        if (isNaN(stop_id)) {
            return res.status(400).json({message: messages.fieldIsNaN('Stop ID', stop_id)})
        }
        // get the current clock time on the epoch date
        var now = dateFormat(new Date(), "HH:MM:ss")        
        now = setDate(now)
        // find the next vehicle
        var time = await Times.findOne({
            stop_id,
            time: { "$gt": now }
        })
        // if no hits, get the first train tomorrow
        const midnight = setDate('00:00:00')
        if (!time) {
            time = await Times.findOne({
                stop_id,
                time: { "$gt": midnight },
            })
        }
        if (!time) {
            return res.status(404).json({message: messages.noVehiclesAtStop(stop_id)}).send()
        }
        res.send({
            line_id: time.line_id,
            stop_id: time.stop_id,
            time: getTime(time.time)
        });
    } catch (e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = {app};