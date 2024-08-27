const express = require('express');
const multer = require('multer');
const path = require("path");
const router = express.Router();
const postController = require('../../controller/web/postController');
const { auth } = require('../../middleware/auth');
const validate = require('../../middleware/validation');
const { createPostSchema, listPostSchema } = require('../../validation/web/postSchemaValidation');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, path.join(__dirname + '../../../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\s+/g, "-"))
    }
});

const uploadImage = multer({ storage: storage });

router.post('/create', auth, uploadImage.array('files', 2), validate(createPostSchema), postController.createPost);
router.get('/list', auth, validate(listPostSchema), postController.listPost);

module.exports = { router }