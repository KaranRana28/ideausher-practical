const { statusCode, error, commanMessage } = require("../utils/responseConstant");

const checkUserRole = (roleType) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (userRole === roleType) {
            next();
        } else {
            res.send(error(commanMessage.AUTHORAZATION, {}, statusCode.UNAUTHORIZED));
        }
    };
};

module.exports = checkUserRole