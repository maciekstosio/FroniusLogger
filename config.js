module.exports = {
    host: 'http://192.168.8.193',//IP to inverter in your local network
    apiDirectory: '/solar_api/v1/',
    fileNameFormat: 'Y_MM_DD',//Format of file {$fileNameFormat}.json, moment library is used https://momentjs.com
    logPath: './data/',
    indexFileName: 'index.json',
};
