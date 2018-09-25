const fs = require('fs');
const constant = require('./constant');
const path = require('path');

// test
exports.test = (argument) => {
console.log("test");
}


// io
exports.readFileSync = (path) => {
    try {
        var content = fs.readFileSync(path, 'utf8');
    } catch (error) {
        console.log(error);
    }
    return content;
}

exports.convertRecord2Json = (recordStr) => {
    try {
        var json = JSON.parse(recordStr.slice(0, -1));
    } catch (error) {
        return null;
    } finally {
        return json;
    }
}

// object
exports.clone = (src) => {
    return JSON.parse(JSON.stringify(src));
}

exports.loadReportConfigTmpl = () => {
    return fs.readFileSync(constant.REPORT_CONFIG_TMPL_PATH, 'utf8');
};

exports.loadSectionConfigTmpl = () => {
    return fs.readFileSync(constant.SECTION_CONFIG_TMPL_PATH, 'utf8');
};




