os = require('os');
util = require('../util');

exports.loadSectionConfigList = (configPath) => {
    try {
        var content = util.readFileSync(configPath);
        var sectionConfigList = JSON.parse(content);
    } catch (error) {
        console.log(error);
    }
    return sectionConfigList;
}
