module.exports = {
    /**
     * @param   {String}    time    A string (HH:MM:ss) with no date information
     * @return  {Date}              Attaches the unix epoch as a default date
     */
    setDate: (time) => {
        return new Date('Jan 1 1970 ' + time);
    },
    /**
     * @param   {Date}      date    A Date object
     * @return  {String}            The time portion of the date, HH:MM:ss
     */
    getTime: (date) => {
        return date.toTimeString().split(' ')[0];
    },

    messages: {
        lineNotFound: (line) => `Line ${line} not found`,
        missingParameter: (params) => `Required parameter missing; please specify ${params}`,
        stopNotFound: (x, y) => `No stop found at coordinates x:${x} y:${y}`,
        noVehiclesAtStop: (stopId, time) => `No vehicles arriving at stop ${stopId}`,
        noVehicleAtStopAtTime: (stopId, time) => `No vehicle arriving at stop ${stopId} at ${time}`,
        fieldIsNaN: (fieldName, fieldValue) => `${fieldName} ${fieldValue} is not a number`,

    }
}