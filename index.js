const axios = require("axios");
const fs = require('fs');
const moment = require('moment');
const config = require('./config');

const emptyObject = {
    total: 0,
    logs: [],
};

const API_CALLS = {
    GET_REALTIME_DATA: 'GetInverterRealtimeData.cgi',
};

const getData = async url => {
  try {
    const response = await axios.get(url, {
        params: {
            Scope: 'Device',
            DeviceId: '1',
            DataCollection: 'CumulationInverterData'
        }
    });

    return response.data.Body.Data
  } catch (error) {
    console.log(error);
  }
};

const read = filePath => {
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
    } catch(err) {
        return emptyObject
    }
};

const write = (filePath, data) => {
    fs.writeFile(filePath, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved data to file ' + filePath);
      });
};

const getFileName = () => config.logPath + moment().format(config.fileNameFormat) + '.json'

const log = async () => {
    const {host, apiDirectory} = config

    const logData = await getData(host + apiDirectory + API_CALLS.GET_REALTIME_DATA);
    const newLog = {
        value: logData.PAC.Value || 0,
        timestamp: new Date(),
    };    
    
    const readFile = read(getFileName())
    const newLogData = {
        total: logData.DAY_ENERGY.Value || 0,
        logs: [...readFile.logs, newLog]
    };

    const allFilesInLogsDirectory = fs.readdirSync(config.logPath)
    const allFilesInLogsDirectoryWithoutIndex = allFilesInLogsDirectory.filter(fileName => fileName !== config.indexFileName)

    const newIndexData = {
        total: logData.TOTAL_ENERGY.Value || 0,
        logFiles: allFilesInLogsDirectoryWithoutIndex,
    };

    write(getFileName(), newLogData)
    write(config.logPath + config.indexFileName, newIndexData)
}

try {
    log()
} catch(err) {
    console.log("Log fail", err)
}