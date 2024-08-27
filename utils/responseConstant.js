const { encryption } = require("../config/commonFunction");
const crypto = require('crypto');

let statusCode = Object.freeze({
    CONTINUE: 100,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    TOO_EARLY: 425,
    UPGRADE_REQUIRED: 426,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    VARIANT_ALSO_NEGOTIATES: 506,
    INSUFFICIENT_STORAGE: 507,
    LOOP_DETECTED: 508,
    BANDWIDTH_LIMIT_EXCEEDED: 509,
    NOT_EXTENDED: 510,
    NETWORK_AUTHENTICATION_REQUIRED: 511,
});

let commanMessage = Object.freeze({
    CREATED: ":name created successfully",
    ALREDY_EXISTS: ":name already exists",
    NOT_FOUND: ":name not found",
    UPLOAD_SUCESSFULLY: ":name uploaded successfully",
    GET: ":name get successfully",
    UPDATE: ":name has been updated successfully",
    REQUIRED: ":name filed is required",
    DELETED: ":name has been deleted successfully",
    AUTHORAZATION: "Access Denied",
    NOT_PURCHASED: ":name not purchased",
    NOT_PUBLISHED: ":name not published",
    ADDED: ":name has been added successfully"
})

let success = function (message, data, code, notificationFlag = false, isSocket = false, client = null, event = "") {

    let encryptData;
    encryptData = encryption(data);

    const result = {
        msg: message ?? "Success",
        data: encryptData ?? {},
        code: code,
        notificationFlag: notificationFlag,
        error: false,
        event: event
    };

    if (isSocket && client?.emit) {
        client.emit("response", result);
        return
    } else if (client) {
        io.to(client).emit("response", result);
    }
    return result
};

let error = function (message, error = null, code) {
    return {
        msg: message ?? "SomeThing Went Wrong !",
        data: error,
        code: code ?? 400,
        error: true,
    };
};

module.exports = {
    statusCode: statusCode,
    commanMessage: commanMessage,
    success: success,
    error: error
}