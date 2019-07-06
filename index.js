const axios = require("axios");
const fs = require('fs');
const moment = require('moment');

const config = {
    host: 'http://192.168.8.193',
    apiDirectory: '/solar_api/v1/',
    fileNameFormat: 'Y_MM_DD',//Moment library is used https://momentjs.com
    basePath: './data/',
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
    return response.data.Body.Data.PAC
  } catch (error) {
    console.log(error);
  }
};

const read = filePath => {
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
    } catch(err) {
        return []
    }
};

const write = (filePath, data) => {
    fs.writeFile(filePath, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved data to file ' + filePath);
      });
};

const getFileName = () => config.basePath + moment().format(config.fileNameFormat) + '.log'

const log = async () => {
    const {host, apiDirectory} = config

    const logData = await getData(host + apiDirectory + API_CALLS.GET_REALTIME_DATA);
    const newLog = {
        ...logData,
        timestamp: new Date(),
    }
    
    console.log("newLog", newLog)
    
    const readFile = read(getFileName())
    
    console.log("readFile", readFile)
    
    const newData = [...readFile, newLog]
    
    console.log("newData", newData)
    
    write(getFileName(), newData)
}
try {
    log()
} catch(err) {
    console.log("Log fail", err)
}