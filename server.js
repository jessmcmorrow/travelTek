const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
const app = express();
const statHelper = require('./statistics.js');

Object.prototype.allPropertiesHaveAString = () => {
    let _obj = this;
    return Object.keys(_obj).filter(p => _obj[p].length > 0).length == Object.keys(_obj).length
}

app.get('/api', (req, res) => {
    fs.readFile(__dirname + '/flighdata_A.xml', (err, data) => {
        parser.parseString(data, (parseErr, result) => {

            const flightObjects = result.flights.flight;

            // an array of all the segmented flights
            const segments = flightObjects
                .filter(x => x.segments !== undefined)
                .reduce((accum, x) => {
                    return accum.concat(x.segments.segment);
                }, [])
                .filter(x => x.depdate !== "") // addressing issue with source data
                .map(x => { 
                    let seg = new Object();
                    seg.depcode = x.depcode;
                    seg.arrcode = x.arrcode;
                    seg.depdate = x.depdate;
                    seg.deptime = x.deptime;
                    seg.arrdate = x.arrdate;
                    seg.arrtime = x.arrtime;
                    seg.class = x.class;
                    return seg;
                });

            // an array of all non-segmented flights with segment-like property names
            const flightsLikeSegments = flightObjects
                .filter(x => x.segments === undefined)
                .reduce((accum, x) => {
                    let seg = new Object();
                    if (x.inflightno.length) {
                        seg.depcode = x.depair;
                        seg.arrcode = x.destair;
                        seg.depdate = x.indepartdate;
                        seg.deptime = x.indeparttime;
                        seg.arrdate = x.inarrivaldate;
                        seg.arrtime = x.inarrivaltime;
                        seg.class = x.inflightclass;
                        if (seg.allPropertiesHaveAString()) {
                            accum.push(seg);
                        }
                    }
                    if (x.outflightno.length) {
                        seg = new Object();
                        seg.depcode = x.depair;
                        seg.arrcode = x.destair;
                        seg.depdate = x.outdepartdate;
                        seg.deptime = x.outdeparttime;
                        seg.arrdate = x.outarrivaldate;
                        seg.arrtime = x.outarrivaltime;
                        seg.class = x.outflightclass;
                        if (seg.allPropertiesHaveAString()) {
                            accum.push(seg);
                        }
                    }
                    return accum;
                }, []);

            // all segmented flights and non-segmented flights together
            const flights = flightsLikeSegments.concat(segments);

            const stats = [{
                'title': 'What’s the average journey time between London Heathrow (LHR) and Dubai (DXB)?',
                'value': statHelper.stat1(flights)
            },
            {
                'title': 'How many of the flights depart in the morning (before 12PM)?',
                'value': statHelper.stat2(flights)
            },
            {
                'title': 'What percentage of the total set of flights fly into Sweden?',
                'value': statHelper.stat3(flights)
            },
            {
                'title': 'What is the ten most popular destination airports?',
                'value': statHelper.stat4(flights)
            },
            {
                'title': 'How many of the flights are business class?',
                'value': statHelper.stat5(flights)
            }]
            console.log(stats);
            return res.json(stats);
        })
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

