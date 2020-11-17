
// custom response function
sendSuccessResponse = async ({res, status = 200, message = null, data = null}) => {
    var response = {
        status : status,
        success : true
    };
    
    if(message) response.message = message;
    if(data) response.data = data;
    
    res.status(status).send(response);
}

sendErrorResponse = ({res, status = 500, message = null, data = null}) => {
    var response = {
        status : status,
        success : false
    };

    if(message) response.message = message;
    if(data) respone.data = data;

    res.status(status).send(response);
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
}