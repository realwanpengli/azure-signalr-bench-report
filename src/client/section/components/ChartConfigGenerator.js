const util = require('../../../util/util');
exports.filter = (dataDict, patternList) => {
    var keys = Object.keys(dataDict);
    var tobeDeletedKey = keys.filter(key => !containsPattern(patternList, key));
    tobeDeletedKey.forEach(key => delete dataDict[key]);
    return dataDict;
}

function containsPattern(patternList, key) {
    var containsKey = patternList.filter(pattern => key.indexOf(pattern) >= 0).length > 0;
    return containsKey;
}

exports.generate = (type, dataDict, labels) => {
    let chartConfigTmpl = require('../../../config/chart_configs/chartConfig.json');
    let chartConfig = util.clone(chartConfigTmpl);
    switch (type) {
        case "stack-line":
            let optionsTmpl = require('../../../config/chart_configs/stackLineChartOption.json');
            let options = util.clone(optionsTmpl);
            let datasetList = generateLineDatasetList(dataDict);
            chartConfig.type = "line";
            chartConfig.data.datasets = datasetList;
            chartConfig.data.datasets.forEach((dataset, i) => dataset.fill = i == 0? true : '-1');
            chartConfig.data.labels = simplifyLabels(labels);
            chartConfig.options = options;
            break;
        case "pie":

            break;
        default:
            break;
    }
    return chartConfig;
}

function simplifyLabels(labels) {
    return labels.map(label => label.substring(11, label.length - 1));
}

function generateLineDatasetList(dataDict) {
    let chartColorDictTmpl = require('../../../config/chart_configs/chartColor.json');
    let chartColorDict = util.clone(chartColorDictTmpl);
    let chartColorList = Object.keys(chartColorDict).map(colorName => chartColorDict[colorName]);
    let lineDataSetTmpl = require('../../../config/chart_configs/lineDataset.json');
    let labels = Object.keys(dataDict);
    let datasetList = labels.map((label, i) => {
        let lineDataSet = util.clone(lineDataSetTmpl);
        lineDataSet.data = dataDict[label];
        lineDataSet.label = label;
        lineDataSet.borderColor = chartColorList[i % chartColorList.length];
        lineDataSet.backgroundColor = chartColorList[i % chartColorList.length];
        return lineDataSet;
    });
    return datasetList;
}

exports.absoluteDataToPercentData = function(dataDict) {
    let keys = Object.keys(dataDict);
    let len = dataDict[keys[0]].length;
    let percentDataDict = {};
    keys.forEach(key => percentDataDict[key] = []);
    for (let i = 0; i < len; i++) {
        // const reducer = (accumulator, key) => accumulator + dataDict[key][i];
        // let sum = keys.reduce(reducer, 0);
        let sum = 0;
        keys.forEach(key => sum += dataDict[key][i]);
        if (sum == 0) keys.forEach(key => percentDataDict[key].push(0));
        else keys.forEach(key => percentDataDict[key].push(dataDict[key][i] / sum * 100));
    }
    return percentDataDict;
}



