const resultCollector = require('../util/result_handler/resultCollector');
const resultFilter = require('../util/result_handler/resultFilter');
const fs = require('fs');

// resultCollector.collectResult("/Users/albertxavier/", "signalr-bench-statistics", "logs", "master", callback);

// function callback(logList) {
//     console.log('logList', logList);
//     logList.forEach(path => {
//         console.log('path', path);
//         let results = fs.readFileSync(path, 'utf8');
//         let middleResultList = resultFilter.extractMiddleResultList(results, 'current step: up5000');
//         console.log(middleResultList, 'middleResultList');
//     });
// }

let dict = resultCollector.collectResult("/Users/albertxavier/", ["signalr-bench-statistics"], "job.yaml", "counters.txt");
console.log(JSON.stringify(dict));
