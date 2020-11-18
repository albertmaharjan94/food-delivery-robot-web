const response = require('./response.helper');
const file = require('./file.helper');

module.exports= {
    sendSuccessResponse : response.sendSuccessResponse,
    sendErrorResponse : response.sendErrorResponse,
    uploadMany : file.uploadMany,
    uploadOne : file.uploadOne,
    deleteMany : file.deleteMany,
    deleteOne : file.deleteOne
}
