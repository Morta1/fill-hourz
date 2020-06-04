const calcHours = require('./calculateHours');
const fs = require('fs')
const hours = calcHours('hours.xlsx', 'workingHours.xlsx');

fs.writeFile('hours.json', JSON.stringify(hours), (err) => {
    if (err) console.log(err);
});