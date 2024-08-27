const express = require('express');
const router = express.Router();
const userController = require('../../controller/cms/userController');
const { auth } = require('../../middleware/auth');
const { USER_ROLE_OBJ } = require('../../constant/userConstant');
const checkUserRole = require('../../middleware/userRole');


router.get('/get', auth, checkUserRole(USER_ROLE_OBJ.ADMIN), userController.getUser);
router.post('/disable', auth, checkUserRole(USER_ROLE_OBJ.ADMIN), userController.deactiveUser);
module.exports = { router }