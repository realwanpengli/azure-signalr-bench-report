const fs = require('fs');
const path = require('path');
const constant = require('../constant.js');

/**
 * 
 * @param {*} root Root directory to search
 * @param {*} prefix prefix to narrow down the range to search
 * @param {*} configName 
 * @param {*} resultName 
 */
function collectResult(root, prefix, configName, resultName) {

    let files = fs.readdirSync(root, 'utf8');
    let timestampDirRootList = files.filter(file => file.indexOf(prefix) == 0 && isDirectory(path.join(root, file)));
    timestampDirRootList = timestampDirRootList.map(timestamp => path.join(root, timestamp));

    let scenarioMat = timestampDirRootList.map(timestamp => {
        let files = fs.readdirSync(timestamp, 'utf8');
        let scenarioPathList = files.map(file => path.join(timestamp, file))
        scenarioPathList = scenarioPathList.filter(isDirectory);
        return scenarioPathList;
    });

    let dict = {};
    timestampDirRootList.forEach(timestamp => dict[timestamp] = []);
    scenarioMat.forEach((scenarioList, i) => scenarioList.forEach(scenario => {
        let obj = {};
        obj[constant.SUB_DIRECTORY_SCENARIO] = path.basename(scenario);
        obj[constant.SUB_DIRECTORY_CONFIG] = `${path.join(scenario, constant.SUB_DIRECTORY_CONFIG, configName)}`;
        obj[constant.SUB_DIRECTORY_LOG] = `${path.join(scenario, constant.SUB_DIRECTORY_LOG, resultName)}`;
        
        dict[timestampDirRootList[i]].push(obj);
    }));

    return dict;
};

function isDirectory(input) {
    return fs.statSync(input).isDirectory();
}

function generateSectionConfig(savePath, rawConfigDict) {
    let sectionConfigTmpl = fs.readFileSync(savePath, 'urf8');
    let sectionCfgList = [];
    Object.keys(rawConfigDict).forEach(timestamp => {
        rawConfigDict[timestamp].forEach(scenario => {
            let sectionCfg = JSON.parse(sectionConfigTmpl);
            const jobCfgPath = rawConfigDict[timestamp]["config"];
            const countersPath = rawConfigDict[timestamp]["counters"];
            sectionCfg["id"] = `${timestamp}_${scenario}`;
            sectionCfg["title"] = `${timestamp} ${scenario}`;
            sectionCfg['record_path'] = countersPath;
            sectionCfg['comment_path'] = '';
            sectionCfg['charts']['id'] = `${timestamp}_${scenario}_chart`;
            sectionCfg['table_paths'] = '';
            sectionCfgList.push(sectionCfg);
        });
    });
    return sectionCfgList;

}

exports.collectResult = collectResult;
