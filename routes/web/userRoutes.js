const express = require('express');
const router = express.Router();
const userController = require('../../controller/web/userController');
const { auth } = require('../../middleware/auth');
const validate = require('../../middleware/validation');
const { signUpSchema, loginSchema, updatePasswordSchema, updateUserSchema } = require('../../validation/web/userSchemaValidation');

router.post('/signUp', validate(signUpSchema), userController.signupUser);
router.post('/logIn', validate(loginSchema), userController.loginUser);
router.post('/updatePassword', auth, validate(updatePasswordSchema), userController.updatePassword);
router.post('/updateUser', auth, validate(updateUserSchema), userController.updateUser);

module.exports = { router }