class BaseError extends Error {
    constructor(errorType, message) {
        super(message);
        this.errorType = errorType
    }
}

module.exports = {
    notFound: { title: 'not found', status: 404 },
    internalServerError: { title: 'internal Server Error', status: 500 },
    serviceUnavailable: { title: 'service Unavailable', status: 503 },
    badRequest: { title: 'bad Request', status: 400 },
}

module.exports.BaseError = BaseError
