const os = require('os');
const constant = require('../constant');

exports.extractMiddleResultList = (resultLog, barrier) => {
    let lines = resultLog.split(os.EOL);
    
    let barrierIndList = [];
    lines.forEach((line, i) => {
        if (line.indexOf(barrier) >= 0) {
            barrierIndList.push(i);
        }
    });
    let middleResultList = [];
    barrierIndList.forEach(barrierInd => {
        if (barrierInd > 1) middleResultList.push(lines[barrierInd - 2]);
    });
    
    middleResultList = middleResultList.map(line => extractJson(line));
    middleResultList = middleResultList.filter(line => typeof (line) != 'undefined' && line != null);
    return middleResultList;
};

exports.convertToPercent = (rec, rules) => {
    let counters = rec[constant.RECORD_COUNTERS_KEY];
    let keys = Object.keys(counters);
    
    let sum = 0;
    keys = filterKeys(keys, rules);

    keys.forEach(key => sum += counters[key]);
    if (sum == 0) keys.forEach(key => counters[key] = 0);
    else keys.forEach(key => counters[key] /= sum);

    return counters;
};

exports.generateMessagePercentageTable = (countersList, rules) => {
    let keys = Object.keys(countersList[0]);
    keys = filterKeys(keys, rules);
    let heads = keys.map(key => key);
    let rows = countersList.map(counters => keys.map(key => counters[key]));
    return [heads].concat(rows);
}

function filterKeys(keys, rules) {
    keys = keys.filter(key => {
        let valid = false;
        for (let rule of rules) {
            if (rule.test(key)) valid = true;
        }
        return valid;
    });
    return keys;
}

function extractJson(line) {
    const beg = line.indexOf("{");
    const end = line.lastIndexOf("}");
    if (beg < 0 || end < 0 || beg > end) return null;
    let record = line.substring(beg, end + 1);
    try {
        record = JSON.parse(record);
        return record;
    } catch(error) {
        return null;
    }
}