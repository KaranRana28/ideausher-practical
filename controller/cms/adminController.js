const { generateToken, decrypt } = require('../../config/commonFunction');
const userConstant = require('../../constant/userConstant');
const User = require('../../model/user');
const { success, error, statusCode, commanMessage } = require('../../utils/responseConstant');
const bcrypt = require('bcrypt');

const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = {}, message, token;

        let isUserExist = await User.findOne({ email: email.toLowerCase(), role: userConstant.USER_ROLE_OBJ.ADMIN }).select('email password role')

        if (!isUserExist) {
            res.status(statusCode.BAD_REQUEST).send(error('Admin user not found.', statusCode.BAD_REQUEST));
            return
        }

        let decryptedPassword = await decrypt(password, isUserExist.password);

        if (!decryptedPassword) {
            res.status(statusCode.BAD_REQUEST).send(error("Email or Password is incorrect."));
            return;
        }

        token = await generateToken(isUserExist, process.env.JWT_SECRET_KEY.toString());

        user = {
            _id: isUserExist._id,
            role: isUserExist.role,
            email: isUserExist?.email.toLowerCase(),
            token: token
        }

        res.send(success('Admin login successfully.', user, statusCode.OK));

    } catch (err) {
        console.log(err)
        res.send(error(err.message, statusCode.BAD_REQUEST));
    }
};

module.exports = {
    adminLogin: adminLogin
}