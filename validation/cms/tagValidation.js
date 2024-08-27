const Joi = require('joi');


const tagSchemaValidation = Joi.object({
    name: Joi.string().required()
}).options({ abortEarly: false });

const updateTagSchemaValidation = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required()
}).options({ abortEarly: false });

const deleteTagSchemaValidation = Joi.object({
    id: Joi.string().required()
}).options({ abortEarly: false });

module.exports = {
    tagSchemaValidation: tagSchemaValidation,
    updateTagSchemaValidation: updateTagSchemaValidation,
    deleteTagSchemaValidation: deleteTagSchemaValidation
}