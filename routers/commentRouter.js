const express = require('express');
const router = express.Router();
const multer = require('multer');

const commentController = require('../controllers/commentController');
const postController = require('../controllers/postController');

const tokenValidationMiddleware = require('../middleware/tokenValidationMiddleware');

const sealingPostController = require('../controllers/sealingPostController');
const sealingPostCommentController= require('../controllers/sealingPostCommentController');
const pictureController = require('../controllers/pictureController');

const upload = multer();



router.post('/createComment', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, commentController.createComment,postController.increaseComment,pictureController.sendPicture);
router.post('/deleteComment', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, commentController.deleteComment,postController.decreaseComment);
router.post('/editComment',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware, commentController.editComment);
router.post('/showComments',pictureController.upload,tokenValidationMiddleware.tokenValidationMiddleware, commentController.showComments,pictureController.sendPicture);


router.post('/createSealingPostComments', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, sealingPostCommentController.createComment,sealingPostController.increaseComment,pictureController.sendPicture);
router.post('/deleteSealingPostComments', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, sealingPostCommentController.deleteComment,sealingPostController.decreaseComment);
router.post('/editSealingPostComments',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware, sealingPostCommentController.editComment);
router.post('/showSealingPostComments', pictureController.upload,tokenValidationMiddleware.tokenValidationMiddleware, sealingPostCommentController.showComments,pictureController.sendPicture);


module.exports = router;