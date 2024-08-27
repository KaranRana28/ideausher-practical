const Joi = require('joi');

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().max(20).min(6),
}).options({ abortEarly: false });

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().max(20).min(6),
}).options({ abortEarly: false });

const updatePasswordSchema = Joi.object({
    password: Joi.string().required().max(20).min(6),
}).options({ abortEarly: false });

const updateUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
}).options({ abortEarly: false });

module.exports = {
    signUpSchema: signUpSchema,
    loginSchema: loginSchema,
    updatePasswordSchema: updatePasswordSchema,
    updateUserSchema: updateUserSchema
}