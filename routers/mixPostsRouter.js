const express = require('express');
const router = express.Router();
const tokenValidationMiddleware = require('../middleware/tokenValidationMiddleware');
const mixPostsController = require('../controllers/mixPostsController');
const pictureController = require('../controllers/pictureController');
const multer = require('multer');
const upload = multer();

router.post('/profilePosts', pictureController.upload,tokenValidationMiddleware.tokenValidationMiddleware, mixPostsController.profilePosts,pictureController.sendPictureP,mixPostsController.profilePostsFinal);
router.post('/personPosts', pictureController.upload,tokenValidationMiddleware.tokenValidationMiddleware, mixPostsController.personPosts,pictureController.sendPictureP,mixPostsController.profilePostsFinal);

router.post('/friendsPosts',pictureController.upload, tokenValidationMiddleware.tokenValidationMiddleware, mixPostsController.friendsPosts,pictureController.sendPicture);

module.exports = router;