const response = require('./response.helper');
const file = require('./file.helper');

module.exports= {
    sendSuccessResponse : response.sendSuccessResponse,
    sendErrorResponse : response.sendErrorResponse,
    uploadFiles : file.uploadFiles
}
