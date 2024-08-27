const express = require('express');
const adminRoute = require('./cms/adminRoutes');
const tagRoute = require('./cms/tagRoutes');
const userWebRoute = require('./web/userRoutes');
const userCmsRoute = require('./cms/userRoutes');
const postWebRoute = require('./web/postRoutes');
const router = express.Router();


// CMS Routes
router.use("/cms/admin", adminRoute.router);
router.use("/cms/tag", tagRoute.router);
router.use('/cms/user', userCmsRoute.router);

// WEB Routes
router.use("/web/user", userWebRoute.router);
router.use("/web/post", postWebRoute.router);

module.exports = router;