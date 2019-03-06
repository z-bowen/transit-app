const expect = require('expect');
const request = require('supertest');
const {app} = require('../server');
var {mongoose} = require('../db/mongoose')

const {populateDelays, populateLines, populateStops, populateTimes} = require('./seed/seed')
const {messages} = require('../utils/utils')

beforeEach(populateDelays);
beforeEach(populateLines);
beforeEach(populateStops);
beforeEach(populateTimes);

describe('GET /delays/:line', () => {
    it('should get the delays on the line', (done) => {
        request(app)
            .get('/delays/X1')
            .expect(200)
            .expect((res) => {
                expect(res.body.line_name).toBe('X1');
                expect(res.body.delay).toBe(1);
            })
            .end(done);
    });

    it('should return a delay of 0 if there is no delay', (done) => {
        request(app)
            .get('/delays/X2')
            .expect(200)
            .expect((res) => {
                expect(res.body.line_name).toBe('X2');
                expect(res.body.delay).toBe(0);
            })
            .end(done)
    });

    it('should return 404 if the line does not exist', (done) => {
        request(app)
            .get('/delays/X3')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe(messages.lineNotFound('X3'))
            })
            .end(done)
    })
});

describe('GET /times', () => {
    it('should return line information matching the place and time queried', (done) => {
        request(app)
            .get('/times')
            .query({x: 1, y: 1, time: '23:59:59'})
            .expect(200)
            .expect((res) => {
                expect(res.body.line_id).toBe(1);
                expect(res.body.stop_id).toBe(1);
                expect(res.body.time).toBe('23:59:59');
            })
            .end(done)
    });

    it('should return 404 if any parameters are missing', (done) => {
        request(app)
            .get('/times')
            .query({x: 1, time: '11:11:11'})
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe(messages.missingParameter('{time, x, y}'))
            })
            .end(done)
    });

    it('should return 404 if no stop exists at the coordinates', (done) => {
        request(app)
            .get('/times')
            .query({x: 0, y: 0, time: '11:11:11'})
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe(messages.stopNotFound(0, 0))
            })
            .end(done)
    });

    it('should return 404 if no vehicle is arriving at the time', (done) => {
        request(app)
            .get('/times')
            .query({x: 1, y: 1, time: '22:22:22'})
            .expect(404)
            .expect((res) => {                
                expect(res.body.message).toBe(messages.noVehicleAtStopAtTime(1, '22:22:22'))
            })
            .end(done)
    });
});

describe('GET /stops/:stop_id', () => {
    it('should find the next vehicle arriving at the stop', (done) => {
        request(app)
            .get('/stops/1')
            .expect(200)
            .expect((res) => {                
                expect(res.body.line_id).toBe(1);
                expect(res.body.stop_id).toBe(1);
                expect(res.body.time).toBe('23:59:59');
            })
            .end(done)
    });

    it('should find the first vehicle of the day if there are no more arriving that day', (done) => {
        request(app)
            .get('/stops/2')
            .expect(200)
            .expect((res) => {                
                expect(res.body.line_id).toBe(1);
                expect(res.body.stop_id).toBe(2);
                expect(res.body.time).toBe('00:00:01');
            })
            .end(done)
    });

    it('should return 400 if a non-numeric stop_id is provided', (done) => {
        request(app)
            .get('/stops/x')
            .expect(400)
            .expect((res) => {                
                expect(res.body.message).toBe(messages.fieldIsNaN('Stop ID', 'x'));
            })
            .end(done)
    });

    it('should return 404 if the stop_id does not exist', (done) => {
        request(app)
            .get('/stops/0')
            .expect(404)
            .expect((res) => {                
                expect(res.body.message).toBe(messages.noVehiclesAtStop(0));
            })
            .end(done)
    });
});