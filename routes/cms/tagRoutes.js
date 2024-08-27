const express = require('express');
const router = express.Router();
const TagController = require('../../controller/cms/tagController');
const validate = require('../../middleware/validation');
const { tagSchemaValidation, updateTagSchemaValidation, deleteTagSchemaValidation } = require('../../validation/cms/tagValidation');
const { auth } = require('../../middleware/auth');

router.post('/add', auth, validate(tagSchemaValidation), TagController.addTag);
router.put('/update', auth, validate(updateTagSchemaValidation), TagController.updateTag)
router.delete('/delete', auth, validate(deleteTagSchemaValidation), TagController.deleteTag)
module.exports = { router }