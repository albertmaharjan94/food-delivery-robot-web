// custom response function
sendSuccessResponse = (res, msg = null, data = null) => {
    var response = {
        status : 200,
        success : true
    };

    if(msg) response.message = msg;
    if(data) respone.data = data;

    res.status(status).send(response);
}

sendErrorResponse = (res, status = 500, msg = null, data = null) => {
    var response = {
        status : status,
        success : false
    };

    if(msg) response.message = msg;
    if(data) respone.data = data;

    res.status(status).send(response);
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
}