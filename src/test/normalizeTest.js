var nmlz = require('../util/data_handler/dataNormalizer');
var dataDict = nmlz.normalize('data/counters.txt');
var timeList = nmlz.getTimeList('data/counters.txt');
console.log(dataDict);
console.log(timeList);