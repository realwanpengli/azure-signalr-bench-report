const express = require('express');
const os = require('os');
const fs = require('fs');
const util = require('../util/util');
const sectionConfigLoader = require('../util/config_handler/sectionConfigLoader');
const dataNormalizer = require('../util/data_handler/dataNormalizer');
const constant = require('../util/constant');
const app = express();


app.use(express.static('dist'));

app.get(constant.SERVER_API_PRINT, (req, res) => {
    res.send({data: req.query.data});
});

app.get(constant.SERVER_API_GET_REPORT_CONFIG_LIST, (req, res) => {
    let reportConfig = JSON.parse(util.readFileSync(constant.REPORT_CONFIG_PATH));
    res.send(reportConfig);
});

app.get(constant.SERVER_API_GET_SECTION_CONFIG_LIST, (req, res) => {
    let sectionConfigPath = req.query.sectionConfigPath;
    let sectionConfigList = sectionConfigLoader.loadSectionConfigList(sectionConfigPath);
    res.send(sectionConfigList);
});

app.get(constant.SERVER_API_GET_COUNTER_DICT_LIST, (req, res) => {
    var recordPathList = req.query.recordPathList;
    var counterDictList = [];
    recordPathList.forEach(path => dataNormalizer.normalize(path, (counterDict) => counterDictList.push(counterDict)));
    res.send(counterDictList);
});

app.get(constant.SERVER_API_GET_COUNTER_DICT, (req, res) => {
    var recordPath = req.query.recordPath;
    dataNormalizer.normalize(recordPath, counterDict => res.send(counterDict));
    ;
});

app.get(constant.SERVER_API_GET_RECORD_TIME_LIST_LIST, (req, res) => {
    var recordPathList = req.query.recordPathList;
    var recordTimeListList = [];
    recordPathList.forEach(path => recordTimeListList.push(dataNormalizer.getTimeList(path, (timeList) => recordTimeListList.push(timeList))));
    res.send(recordTimeListList);
});

app.get(constant.SERVER_API_GET_RECORD_TIME_LIST, (req, res) => {
    var recordPathList = req.query.recordPath;
    dataNormalizer.getTimeList(recordPathList, recordTimeList => res.send(recordTimeList));
});

app.get(constant.SERVER_API_GET_CHART_COLOR, (req, res) => {
    var content = util.readFileSync('../config/chart_configs/chartColor.json');
    var json = JSON.parse(content);
    res.send(json);
});

app.get(constant.SERVER_API_GET_LINE_DATASET_TMPL, (req, res) => {
    var content = util.readFileSync('../config/chart_configs/lineDataset.json');
    var json = JSON.parse(content);
    res.send(json);
});

app.get(constant.SERVER_API_GET_CHART_CONFIG, (req, res) => {
    var content = util.readFileSync('../config/chart_configs/chartConfig.json');
    var json = JSON.parse(content);
    res.send(json);
});

app.get(constant.SERVER_API_GET_STACK_LINE_OPTIONS, (req, res) => {
    var content = util.readFileSync('../config/chart_configs/stackLineChartOption.json');
    var json = JSON.parse(content);
    res.send(json);
});

app.get(constant.SERVER_API_GET_STACK_LINE_OPTIONS, (req, res) => {
    var content = util.readFileSync('../config/chart_configs/stackLineChartOption.json');
    var json = JSON.parse(content);
    res.send(json);
});

app.get(constant.UTIL_READ_FILE, (req, res) => {
    let path = req.query.path;
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.send(data);
            return;
        }
        res.send(data);
    });
});

app.listen(8787, () => console.log('Listening on port 8787!'));

