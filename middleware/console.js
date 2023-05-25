// FAIL / ERRORS
function logReturnError(req, res, statusCode, errorMessage) {
    const timestamp = new Date().toLocaleString();
    const message = `[${timestamp}] [${statusCode}] ${errorMessage} [${req.ip}]`;
    console.error(message);
    return res.status(statusCode).json({ error: errorMessage });
}

// SUCCESS
function logReturnSuccess(req, res, statusCode, successMessage, data) {
    const timestamp = new Date().toLocaleString();
    const message = `[${timestamp}] [${statusCode}] ${successMessage} [${req.ip}]`;
    console.info(message);
    return res.status(statusCode).json(data);
}

function logRespondSuccess(req, res, statusCode, successMessage) {
    const timestamp = new Date().toLocaleString();
    const message = `[${timestamp}] [${statusCode}] ${successMessage} [${req.ip}]`;
    console.info(message);
}

module.exports = {
    logReturnError,
    logReturnSuccess,
    logRespondSuccess
}