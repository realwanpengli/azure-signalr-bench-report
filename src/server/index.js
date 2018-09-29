const express = require('express');
const os = require('os');
const fs = require('fs');
const util = require('../util/util');
const sectionConfigLoader = require('../util/config_handler/sectionConfigLoader');
const dataNormalizer = require('../util/data_handler/dataNormalizer');
const constant = require('../util/constant');
const resultCollector = require('../util/result_handler/resultCollector');
const resultFilter = require('../util/result_handler/resultFilter');
const path = require('path');
const tableGenerator = require('../util/table_handler/tableGenerator');


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

app.get(constant.SERVER_API_GENERATE_DAILY_REPORT_CONFIG, (req, res) => {
    let mode = req.query.mode;
    if (mode && mode != constant.DISPLAY_MODE_DAILY) {
        res.send({});
    } else {
        let reportCfgTmpl = util.loadReportConfigTmpl();
        if (!fs.existsSync(constant.TMP_DIR)) fs.mkdirSync(constant.TMP_DIR);
        let reportCfg = JSON.parse(reportCfgTmpl);
        reportCfg[0]['id'] = 'Regular Test Result';
        reportCfg[0]['title'] = '';
        const timestamp = new Date().getTime();
        reportCfg[0]['section_config_path'] = path.join(constant.TMP_DIR, `section_config_${timestamp}.json`);
        res.send(reportCfg);
    }
});

app.get(constant.SERVER_API_GENERATE_DAILY_SECTION_CONFIG, (req, res) => {
    
    // collect results
    let root = req.query.root;
    let prefix = req.query.prefix;
    let configName = req.query.configName;
    let resultName = req.query.resultName;
    let rules = req.query.rules;
    let barriers = req.query.barriers;
    let resultDict = resultCollector.collectResult(root, prefix, configName, resultName);

    // generate section config

    // load tmpl
    let sectionCfgTmpl = JSON.parse(util.loadSectionConfigTmpl());
    sectionCfgEleTmpl = sectionCfgTmpl[0];

    // generate section config list
    let sectionCfgList = [];
    Object.keys(resultDict).forEach(key => {
        let scenarioList = resultDict[key];
        scenarioList.forEach(scenarioObj => {
            let cfg = util.clone(sectionCfgEleTmpl);
            cfg['id'] = key + '_' + scenarioObj[constant.SUB_DIRECTORY_SCENARIO];
            cfg['title'] = scenarioObj[constant.SUB_DIRECTORY_SCENARIO];
            let logPath = scenarioObj[constant.SUB_DIRECTORY_LOG];
            cfg[constant.SECTION_CONFIG_COUNTERS_PATH_KEY] = logPath;
            cfg['charts'][0]['id'] = key + '_' + scenarioObj[constant.SUB_DIRECTORY_SCENARIO] + '_' + 'chart';
            // cfg['tables_path'] = tableGenerator.generateBasicTables(logPath, rules, barrier);
            cfg['tables_path'] = tableGenerator.generateLt1sTables(logPath, rules, barriers);
            sectionCfgList.push(cfg);
        });
    });


    // save section config list
    let savePath = req.query.savePath;
    fs.writeFileSync(savePath, JSON.stringify(sectionCfgList), 'utf8');

    res.send(null);
});



app.listen(8787, () => console.log('Listening on port 8787!'));




