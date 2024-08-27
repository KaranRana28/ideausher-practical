const { error, statusCode } = require('../utils/responseConstant');

const validate = (schema) => (req, res, next) => {

    const validateError = schema.validate(req.body, { abortEarly: false });

    if (validateError && validateError?.error) {
        const errorDetails = validateError?.error?.details.map((err) => ({ message: err.message, path: err.path }));
        if (errorDetails[0].path[0].toString() == 'email') {
            return res.status(statusCode.BAD_REQUEST).send(error("Email must be a valid email", { message: errorDetails[0].message, path: errorDetails[0].path }, statusCode.BAD_REQUEST));
        } else {
            return res.status(statusCode.BAD_REQUEST).send(error('Validation Error', { message: errorDetails[0].message, path: errorDetails[0].path }, statusCode.BAD_REQUEST));
        }
    }
    next();
};

module.exports = validate;