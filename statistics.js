
const helpers = require('./helpers.js');

const stat1 = (flights) => {
    //What’s the average journey time between London Heathrow (LHR) and Dubai (DXB)?
    const londonAndDubaiAirportCodes = ['LHR','DXB'];
    const allFlights = flights
        .filter(x => londonAndDubaiAirportCodes.includes(x.depcode) && londonAndDubaiAirportCodes.includes(x.arrcode));
    const allFlightsTime = allFlights.reduce((accum, x, i) => {
        let start = Date.parse(`${x.depdate}T${x.deptime}`);
        let end = Date.parse(`${x.arrdate}T${x.arrtime}`);
        //console.log('journeyTime', i + 1, helpers.millisecondsToHours(end - start))
        return accum = accum + (end - start);
    }, 0)
    const average = allFlightsTime / allFlights.length;
    return `${helpers.millisecondsToHours(average)} hours`;
}

const stat2 = (flights) => {
    //How many of the flights depart in the morning (before 12PM)?
    const departures = flights.filter(x => parseInt(x.deptime.split(":")[0]) < 12);
    console.log(departures);
    return `${departures.length}`;
}

const stat3 = (flights) => {
    //What percentage of the total set of flights fly into Sweden?
    const swedishAirportCodes = ['ARN','GOT','NYO','BMA','MMX','LLA'];
    const flightsToSweden = flights.filter(x => swedishAirportCodes.includes(x.arrcode));
    const percentage = flightsToSweden.length / flights.length * 100;
    return `${percentage.toFixed(2)} %`;
}

const stat4 = (flights) => {
    //Top ten popular destinations  
    const destinationsSortedByPopularity = flights
        // destination codes
        .map(x => x.arrcode)
        // filter out the duplicates
        .filter((x, i, arr) => arr.indexOf(x) === i)
        // mapping a count of times a flight has arrived there
        .map(x => {
            let count = flights.filter(flight => flight.arrcode == x).length;
            return { 'code': x, 'count': count };
        })
        // sort by most flights
        .sort((a, b) => {
            return b.count > a.count ? 1 : -1;
        })
        .filter((x, i) => i < 10) // taking the top 10
        // make it a string to display again
        .reduce((accum, x, i, arr) => {
            return accum += x.code + (i !== arr.length-1 ? ',' : '');
        }, "");
    return destinationsSortedByPopularity;
}

const stat5 = (flights) => {
    return 'stat 5';
}

module.exports = { stat1, stat2, stat3, stat4, stat5 };

