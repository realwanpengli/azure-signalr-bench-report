const os = require('os');
const util = require('../util');
const constant = require('../constant');
const counterSorter = require('./counterSorter');
/*
 * normalize array of records based on time to (counters key, counters value list for a period) pairs
 */
exports.normalize = (path) => {
    // read records
    var recordList = getRecordList(path);

    // remove non-json lines
    var recordList = filterNonJsonLines(recordList);

    // get keys in counters
    var keyList = getKeysInCounters(recordList[0]);
    // console.log(keyList);
    // get data list in time for each key
    var dataDict = getDataDict(recordList, keyList);

    return dataDict;
}

exports.getTimeList = (path) => {
    // read records
    var recordList = getRecordList(path);
    
    // remove non-json lines
    var recordList = filterNonJsonLines(recordList);

    // get time list
    var timeList = getTimeList(recordList);

    return timeList;
}

function getRecordList(path) {
    var recordStr = util.readFileSync(path);
    var recordList = recordStr.split(os.EOL);
    return recordList;
}

function getDataDict(recordList, keyList) {
    // prepare data dict
    var dataDict = {};
    keyList.forEach(key => dataDict[key] = []);

    // fill datas
    recordList.forEach(record => {
        var recordDict = JSON.parse(record);
        if (recordDict == null) return;
        var countersDict = recordDict[constant.RECORD_COUNTERS_KEY];
        keyList.forEach(key => {
            dataDict[key].push(countersDict[key]);
        });
    });

    return dataDict;
}

function getTimeList(recordLines) {
    var timeList = [];
    recordLines.forEach(oneLine => {
        var dict = JSON.parse(oneLine);
        if (dict == null) return;
        timeList.push(dict[constant.RECORD_TIME_KEY]);
    });
    return timeList;
}

function getKeysInCounters(recordStr) {
    var countersDict = JSON.parse(recordStr);
    var counters = countersDict[constant.RECORD_COUNTERS_KEY];
    var keys = Object.keys(counters);
    keys = counterSorter.sortMessageKeys(keys);
    return keys;
}

function filterNonJsonLines(recordList) {
    let filteredList = recordList.filter(record => {
        let isJson = false;
        try {
            const beg = record.indexOf("{");
            const end = record.lastIndexOf("}");
            if (beg < 0 || end < 0 || beg > end) return false;
            record = record.substring(beg, end + 1);
            JSON.parse(record);
            isJson = true;
        } catch (error) {
        } finally {
            return isJson;
        }
    });

    let ret = filteredList.map(record => {
        const beg = record.indexOf("{");
        const end = record.lastIndexOf("}");
        record = record.substring(beg, end + 1);
        return record;
    });

    return ret;
}
