const { error } = require("../utils/responseConstant");
const jwt = require('jsonwebtoken');
const User = require("../model/user")
const { ObjectId } = require('mongodb');
const moment = require('moment');
async function auth(req, res, next) {
    const token = req.header("auth");

    if (!token) return res.status(401).send(error("Access Denied. No Token Found"));
    try {
        let payload = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (payload) {
            req.user = payload;
            req.user._id = payload.id;
            const isWebBlockedUser = await User.findOne({ _id: new ObjectId(req.user._id), isDeleted: true });
            if (isWebBlockedUser) {
                return res.status(406).send(error("This account has been disabled. Please contact customer support"));
            }

            const tokenExpireDate = moment(payload.exp * 1000);

            if (tokenExpireDate < Date.now()) {
                return res.status(406).send(error("Token Expired."));
            }

            // Set last access date
            await User.findOneAndUpdate({ email: payload.email.toLowerCase() }, { $set: { lastAccessDate: new Date() } }, { new: true });

            next();
        } else {
            res.status(406).send(error("Invalid Token"));
        }
    } catch (err) {
        console.log(err)
        res.status(406).send(error("Invalid Token"));
    }
}

module.exports = { auth };