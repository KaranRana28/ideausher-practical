const { generateToken, decrypt } = require('../../config/commonFunction');
const User = require('../../model/user');
const { success, error, statusCode, commanMessage } = require('../../utils/responseConstant');
const bcrypt = require('bcrypt');
const userConstant = require('../../constant/userConstant');

const signupUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        let isUserExist = await User.findOne({ email: email.toLowerCase(), role: userConstant.USER_ROLE_OBJ.USER });

        if (isUserExist && isUserExist?.isActive) {

            return res.status(statusCode.BAD_REQUEST).send(error('An account has already been created using this email address. Kindly proceed to sign in.', {}, statusCode.BAD_REQUEST));

        } else if (isUserExist && !isUserExist?.isActive && isUserExist?.isDeleted) {

            return res.status(statusCode.BAD_REQUEST).send(success('Your account has been blocked, please contact to support team.', {}, statusCode.BAD_REQUEST, true));

        } else {

            let addUser = await User.create({ email: email.toLowerCase(), password: password, lastLoginDate: Date.now() });
            let token = await generateToken(addUser, process.env.JWT_SECRET_KEY.toString());

            let user = {
                _id: addUser._id,
                role: addUser.role,
                email: addUser?.email.toLowerCase(),
                token: token,
                isActive: addUser.isActive
            }

            return res.status(statusCode.OK).send(success("An account created successfully.", user, statusCode.OK, true))
        }

    } catch (err) {
        console.log(err)
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error(err.message, statusCode.INTERNAL_SERVER_ERROR));
    }
};

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        let isUserExist = await User.findOne({ email: email.toLowerCase(), role: userConstant.USER_ROLE_OBJ.USER, isActive: true })

        if (!isUserExist) {
            return res.status(statusCode.BAD_REQUEST).send(error('Oops! This user email is not registered yet. Please sign up or try another email.', statusCode.BAD_REQUEST));
        }

        if (isUserExist && isUserExist?.isDeleted) {
            return res.status(statusCode.BAD_REQUEST).send(error('This account has been disabled. Please contact customer support.', statusCode.BAD_REQUEST));
        }

        let decryptedPassword = await decrypt(password, isUserExist.password);

        if (!decryptedPassword) {
            return res.status(statusCode.BAD_REQUEST).send(error("Entered email address and password are incorrect. Please try again.", statusCode.BAD_REQUEST));
        }

        let token = await generateToken(isUserExist, process.env.JWT_SECRET_KEY.toString());

        let user = {
            _id: isUserExist._id,
            role: isUserExist.role,
            firstName: isUserExist.firstName ?? "",
            lastName: isUserExist.lastName ?? "",
            email: isUserExist?.email,
            token: token
        }

        await User.findOneAndUpdate({ _id: isUserExist._id }, { $set: { lastLoginDate: Date.now() } })
        return res.status(statusCode.OK).send(success("User login successfully.", user, statusCode.OK))

    } catch (err) {
        console.log(err)
        res.send(error(err.message, statusCode.BAD_REQUEST));
    }
};

const updatePassword = async (req, res) => {
    try {
        let { password } = req.body;

        let isUserExist = await User.findOne({ _id: req.user._id });

        if (!isUserExist) {
            return res.status(statusCode.BAD_REQUEST).send(error('User not found.', statusCode.BAD_REQUEST));
        }

        if (password) {
            password = await bcrypt.hash(password, 8);
        }

        const updatePassword = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { password: password } });
        return res.status(statusCode.OK).send(success("Password updated successfully.", updatePassword?.email, statusCode.OK));

    } catch (err) {
        console.log(err)
        return res.status(statusCode.BAD_REQUEST).send(error(err.message, statusCode.BAD_REQUEST));
    }
};

const updateUser = async (req, res) => {
    try {
        let { firstName, lastName } = req.body;

        let isUserExist = await User.findOne({ _id: req.user.id });

        if (!isUserExist) {
            return res.status(statusCode.BAD_REQUEST).send(error('User not found.', statusCode.BAD_REQUEST));
        }

        const updateUser = await User.findOneAndUpdate({ _id: req.user.id }, { $set: { firstName: firstName, lastName: lastName } }, { new: true });

        return res.status(statusCode.OK).send(success(commanMessage.UPDATE.replace(':name', 'User'), updateUser, statusCode.OK))
    } catch (err) {
        console.log(err)
        return res.status(statusCode.BAD_REQUEST).send(error(err.message, statusCode.BAD_REQUEST));
    }
};

module.exports = {
    signupUser: signupUser,
    loginUser: loginUser,
    updatePassword: updatePassword,
    updateUser: updateUser
}
