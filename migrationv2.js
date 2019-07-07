const fs = require('fs');
const config = require('./config');

const read = filePath => {
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
    } catch(err) {
        console.log(err)
        return []
    }
};

const write = (filePath, data) => {
    fs.writeFile(filePath, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved data to file ' + filePath);
      });
};

const log = async () => {
    const readFile = read(config.logPath + process.argv[2] + '.json')
    
    const newData = {
        total: 0,
        logs: readFile.logs.map(item => ({
            value: (item.Value || item.value) || 0,
            timestamp: item.timestamp,
        })),
    }
    
    write(config.logPath + process.argv[2] + '.json', newData)
}

try {
    log()
} catch(err) {
    console.log("Log fail", err)
}