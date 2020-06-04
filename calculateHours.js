const fs = require('fs');
const xlsx = require('node-xlsx');

const calculateHours = (sourceName, targetName) => {
  if (!sourceName.endsWith('.xlsx')) {
    sourceName += '.xlsx';
  }
  if (!targetName.endsWith('.xlsx')) {
    targetName += '.xlsx';
  }
  let shittyXl;
  try {
    shittyXl = xlsx.parse(fs.readFileSync(sourceName));
  } catch (error) {
    console.log("Could not read file: " + sourceName, error);
    return error;
  }
  let newXl = [{name: 'שעות בצורה נורמלית', data: [['תאריך', 'יום', 'כניסה', 'יציאה', 'סה"כ']]}];

  if (shittyXl[0].data.length < 2) {
    // There isn't even one day to calculate
    return;
  }

// Getting indexes of content
  let dateIndex, dayIndex, enterIndex, totalIndex;
  for (let i = 0; i < shittyXl[0].data[0].length; i++) {
    switch (shittyXl[0].data[0][i]) {
      case 'תאריך': {
        dateIndex = i;
        break;
      }
      case 'יום': {
        dayIndex = i;
        break;
      }
      case 'כניסה1': {
        enterIndex = i;
        break;
      }
      case 'סה"כ לשכר(0)':
	  case 'סה"כ לשכר': {
        totalIndex = i;
        break;
      }
    }
  }

  let arrayForDaniel = [];
// Now calculate and put every day
  for (let i = 1; i < shittyXl[0].data.length; i++) {
    let objectForDaniel = {};
    if (shittyXl[0].data[i][enterIndex] != 0) {
      let enterTime = getTimeFormatted(shittyXl[0].data[i][enterIndex]);
      let totalTime = getTimeFormatted(shittyXl[0].data[i][totalIndex]);
      let newDay = [shittyXl[0].data[i][dateIndex], shittyXl[0].data[i][dayIndex], enterTime];

      let exitTime = calculateExitTime(enterTime, totalTime);
      newDay.push(exitTime);

      newDay.push(totalTime);
      newXl[0].data.push(newDay);
      objectForDaniel = {in: enterTime, out: exitTime};
    }
    arrayForDaniel.push(objectForDaniel);
  }

  const options = {'!cols': [{ wch: 15 }, { wch: 3 }, { wch: 10 }, { wch: 10 }, { wch: 10 } ]};
  let buffer = xlsx.build(newXl, options);

  fs.writeFileSync(targetName, buffer);

  return arrayForDaniel;
};

function getTimeFormatted(excelTime) {
  let timeDecimal = excelTime * 24;
  let splittedTime = timeDecimal.toString().split('.');
  let minutes = splittedTime[1];
  minutes = Math.round(parseFloat('0.' + minutes) * 60);
  let addedHour = 0;
  if (minutes >= 60) {
    addedHour = 1;
    minutes -= 60;
  }
  let hours = (parseInt(splittedTime[0]) + addedHour).toString();
  minutes = minutes.toString();
  if (hours.length < 2) {
    hours = "0" + hours;
  }
  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }

  return hours + ":" + minutes;
}

function calculateExitTime(enterTime, totalTime) {
  let enterTimeSplitted = enterTime.split(':'),
    totalTimeSplitted = totalTime.split(':');
  let enterTimeHours = enterTimeSplitted[0], enterTimeMinutes = enterTimeSplitted[1],
    totalTimeHours = totalTimeSplitted[0], totalTimeMinutes = totalTimeSplitted[1];
  let addedHour = 0;
  let minutes = parseInt(enterTimeMinutes) + parseInt(totalTimeMinutes);
  if (minutes >= 60) {
    addedHour = 1;
    minutes -= 60;
  }
  let hours = (parseInt(enterTimeHours) + parseInt(totalTimeHours) + addedHour).toString();
  minutes = minutes.toString();
  if (hours.length < 2) {
    hours = "0" + hours;
  }
  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }

  return hours + ":" + minutes;
}

module.exports = calculateHours;