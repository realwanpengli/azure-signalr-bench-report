const fs = require('fs');
const resultFilter = require('../result_handler/resultFilter');
const constant = require('../../util/constant');
const path = require('path');
const os = require('os');


exports.generateBasicTables = (logPath, rules, barrier) => {
    rules = rules.map(rule => new RegExp(rule));
    let content = fs.readFileSync(logPath, 'utf8');
    let resList = resultFilter.extractMiddleResultList(content, barrier);
    let counterList = resList.map(res => res[constant.RECORD_COUNTERS_KEY]);
    let csv = resultFilter.generateMessagePercentageTable(counterList, rules);
    let csvStr = "";
    csv.forEach((row, i) => {
        csvStr += row.join(", ") + (i == csv.length - 1 ? "" : os.EOL);
    });

    let savePath = path.join(constant.TMP_DIR, `table_${new Date().getTime()}.csv`);
    fs.writeFileSync(savePath, csvStr, 'utf8');
    return [savePath];
};

exports.generateLt1sTables = (logPath, rules, barriers) => {
    rules = rules.map(rule => new RegExp(rule));
    let content = fs.readFileSync(logPath, 'utf8');
    let resList = resultFilter.extractMiddleResultList(content, barriers);
    let counterList = resList.map(res => res[constant.RECORD_COUNTERS_KEY]);

    let percentageLt1sList = counterList.map(counter => resultFilter.getPercentLt1sInReceivedMsg(counter, rules));

    let csvStr = "";

    percentageLt1sList.forEach((ele, i) => {
        csvStr += `epoch ${i + 1}`;
        if (i < percentageLt1sList.length - 1)
            csvStr += ', ';
    });
    csvStr += os.EOL;

    percentageLt1sList.forEach((ele, i) => {
        if (!ele) csvStr += "NaN";
        else csvStr += `${(ele * 100).toFixed(2)}%`;
        if (i != percentageLt1sList.length - 1) csvStr += ", ";
    });

    let savePath = path.join(constant.TMP_DIR, `table_${new Date().getTime()}.csv`);
    fs.writeFileSync(savePath, csvStr, 'utf8');
    return [savePath];
};