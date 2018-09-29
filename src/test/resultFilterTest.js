const fs = require('fs');
const resultFilter = require('../util/result_handler/resultFilter');
const constant = require('../util/constant');

let log = fs.readFileSync('/Users/albertxavier/signalr-bench-statistics-suffix/logs/log_master.txt', 'utf8');
let resList = resultFilter.extractMiddleResultList(log, 'current step: up5000');

let rules = [/message:lt:/, /message:ge/, /connection:error/];
// let per = resultFilter.convertToPercent(resList[1], rules);
// console.log(per);

let counterList = resList.map(res => res[constant.RECORD_COUNTERS_KEY]);

let csvContent = resultFilter.generateMessagePercentageTable(counterList, rules);
console.log(csvContent);