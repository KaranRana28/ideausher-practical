const express = require('express');
const router = express.Router();
const adminController = require('../../controller/cms/adminController');
const { auth } = require('../../middleware/auth');
const { USER_ROLE_OBJ } = require('../../constant/userConstant');
const checkUserRole = require('../../middleware/userRole');
const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\s+/g, "-"))
    }
});

const uploadFile = multer({ storage: storage });

router.post('/logIn', adminController.adminLogin);

module.exports = { router }