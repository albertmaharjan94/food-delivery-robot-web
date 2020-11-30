
// custom response function
var sendSuccessResponse = async ({res, status = 200, msg = null, data = null}) => {
    var response = {
        status : status,
        success : true
    };
    
    if(msg) response.message = msg;
    if(data) response.data = data;
    
    res.status(status).send(response);
}

var sendErrorResponse = ({res, status = 500, msg = null, data = null}) => {
    var response = {
        status : status,
        success : false
    };

    if(msg) response.message = msg;
    if(data) response.data = data;

    res.status(status).send(response);
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
}