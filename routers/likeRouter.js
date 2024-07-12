const express = require('express');
const router = express.Router();
const multer = require('multer');
const likeController = require('../controllers/likeController');
const postController = require('../controllers/postController');
const sealingPostController = require('../controllers/sealingPostController');
const pictureController = require('../controllers/pictureController');
const sealingPostLikeController= require('../controllers/sealingPostLikeController');
const tokenValidationMiddleware = require('../middleware/tokenValidationMiddleware');
const upload = multer();

router.post('/createLike', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, likeController.createLike,postController.increaseLike);
router.post('/deleteLike', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, likeController.deleteLike,postController.decreaseLike);
router.post('/showLikes', pictureController.upload,tokenValidationMiddleware.tokenValidationMiddleware, likeController.showLikes,pictureController.sendPicture);

router.post('/createSealingPostLike', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, sealingPostLikeController.createSealingPostLike,sealingPostController.increaseSealingPostLike);
router.post('/deleteSealingPostLike', upload.none(),tokenValidationMiddleware.tokenValidationMiddleware, sealingPostLikeController.deleteSealingPostLike,sealingPostController.decreaseSealingPostLike);
router.post('/showSealingPostLikes', pictureController.upload,tokenValidationMiddleware.tokenValidationMiddleware, sealingPostLikeController.showSealingPostLikes,pictureController.sendPicture);

module.exports = router;