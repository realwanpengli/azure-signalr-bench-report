const fs = require('fs');

exports.test = (argument) => {
console.log("test");
}

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

exports.clone = (src) => {
    return JSON.parse(JSON.stringify(src));
}



