const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
const app = express();


app.get('/api', function (req, res) {
    fs.readFile(__dirname + '/flighdata_A.xml', function (err, data) {
        parser.parseString(data, function (err, result) {
            const flights = result.flights.flight;
            const stats = [{
                    'title': 'What’s the average journey time between London Heathrow (LHR) and Dubai (DXB)?',
                    'value': stat1(flights)
                },
                {
                    'title': 'Which airport day has the most departures from Manchester (MAN)?',
                    'value': stat2(flights)
                },
                {
                    'title': 'What proportion of the flights are business class?',
                    'value': stat3(flights)
                }]
            console.log(stats);
            return res.json(JSON.stringify(stats));
        })
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/style.css');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

function stat1(flights) {
    //What’s the average journey time between London Heathrow (LHR) and Dubai (DXB)?
    let journeys = flights.filter(x => x.depair === 'LHR' && x.destair === 'DXB' || x.depair === 'DXB' && x.destair === 'LHR');
    let allJourneysTime = journeys.reduce((accum, x, i) => {
        let start = Date.parse(`${x.inarrivaldate}T${x.inarrivaltime}`);
        let end = Date.parse(`${x.indepartdate}T${x.indeparttime}`);
        accum += (end.getTime() - start.getTime());
    }, 0)
    let average = allJourneysTime / journeys.length;
    return average;
}

function stat2(flights) { 
    // Which airport day has the most departures from Manchester (MAN)?
    return "";
}

function stat3(flights) {
    return "";
}