const {setDate} = require('../../utils/utils');

module.exports = {
    load : async () => {

        // paths to data files
    
        const dataPath = 'server/db/data/'
        const delaysPath = dataPath + 'delays.csv'
        const linesPath = dataPath + 'lines.csv'
        const stopsPath = dataPath + 'stops.csv'
        const timesPath = dataPath + 'times.csv'

        // importing the data to the db

        const csv = require('csvtojson')
        const delays = await csv().fromFile(delaysPath);
        const lines = await csv().fromFile(linesPath);
        const stops = await csv().fromFile(stopsPath);
        const times = await csv().fromFile(timesPath);
        // set all times to the epoch date so we can store them as Dates in the schema
        // I'm assuming production data would have real dates, so this hack wouldn't be needed...
        times.forEach((entry) => {
            entry.time = setDate(entry.time);
        });        

        d = {delays, lines, stops, times}
    
        return(d)
    }
}