const Joi = require('joi');

const createPostSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    tags: Joi.array().optional()
}).options({ abortEarly: false });

const listPostSchema = Joi.object({
    page: Joi.number().min(1).error(new Error("Current page must be greater than equal to 1")),
    limit: Joi.number().min(1).max(100).error(new Error("Limit must be less than or equal to 100")),
    search: Joi.string().optional().allow(''),
    tags: Joi.array().items(Joi.string().optional()).optional(),
    date: Joi.object({
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
    }).optional().allow(null).options({ stripUnknown: true })
}).options({ abortEarly: false });

module.exports = {
    createPostSchema: createPostSchema,
    listPostSchema: listPostSchema
}