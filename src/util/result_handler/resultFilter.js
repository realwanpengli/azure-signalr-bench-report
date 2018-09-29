const os = require('os');
const constant = require('../constant');

exports.extractMiddleResultList = (resultLog, barriers) => {
    let lines = resultLog.split(os.EOL);
    
    let barrierIndList = [];
    lines.forEach((line, i) => {
        if (barriers.filter(barrier => line.indexOf(barrier) >= 0).length > 0) {
            barrierIndList.push(i);
        }
    });
    let middleResultList = [];
    barrierIndList.forEach(barrierInd => {
        if (barrierInd > 1) middleResultList.push(lines[barrierInd - 2]);
    });
    console.log(barriers, 'barrierIndList', barrierIndList);

    middleResultList = middleResultList.map(line => extractJson(line));
    middleResultList = middleResultList.filter(line => typeof (line) != 'undefined' && line != null);
    return middleResultList;
};

function convertToPercent(counters, rules) {
    // let counters = rec[constant.RECORD_COUNTERS_KEY];
    let sum = sumCountersByRules(counters, rules);
    if (sum == 0) keys.forEach(key => counters[key] = 0);
    else keys.forEach(key => counters[key] /= sum);
    
    keys.forEach(key => counters[key] = `${(counters[key] * 100).toFixed(2)}%`);
    
    return counters;
};

function sumCountersByRules(counters, rules) {
    let keys = Object.keys(counters);

    let sum = 0;
    keys = filterKeys(keys, rules);

    keys.forEach(key => sum += counters[key]);
    return sum;
}

exports.getPercentLt1sInReceivedMsg = (counter, rules) => {
    if (counter[constant.RECORD_CONN_ERROR] && counter[constant.RECORD_CONN_ERROR] > 0) {
        return null;
    }
    let received = counter[constant.RECORD_RECEIVED_MSG];
    let sum = sumCountersByRules(counter, rules);
    return sum == 0 ? null : sum / received;
}

exports.generateMessagePercentageTable = (countersList, rules) => {
    let keys = Object.keys(countersList[0]);
    keys = filterKeys(keys, rules);
    let heads = keys.map(key => key);
    countersList = countersList.map(counters => convertToPercent(counters, rules));
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