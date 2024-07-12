const express = require('express');
const router = express.Router();
const sealingPostController = require('../controllers/sealingPostController');
const sealingPostLikeController = require('../controllers/sealingPostLikeController');
const sealingPostCommentController = require('../controllers/sealingPostCommentController');
const pictureController = require('../controllers/pictureController');
const tokenValidationMiddleware = require('../middleware/tokenValidationMiddleware');
const multer = require('multer');
const upload = multer();


router.post('/createSealingPost',pictureController.upload1, tokenValidationMiddleware.tokenValidationMiddleware,pictureController.addPicture, sealingPostController.addSealingPost);

router.post('/deleteSealingPost',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware,sealingPostLikeController.deletePOstLikes   ,sealingPostCommentController.deletePostComment, sealingPostController.deleteSealingPost,pictureController.deletePicture);





router.post('/editSealingPost', pictureController.upload1, tokenValidationMiddleware.tokenValidationMiddleware, sealingPostController.selectSealingPost,async(req, res, next) => {
    if (req.selectPictureId&&req.selectPictureId!=-1) {
        console.log('hi')
        console.log(req.selectPictureId)

       await pictureController.editPicture(req, res, next);
    } else {
        console.log('hi')

       await pictureController.addPicture(req, res, next);
    }
    console.log(' Always go to postController.editPost')
    sealingPostController.editSealingPost(req, res, next);
});





router.post('/friendsSealingPosts',pictureController.upload, tokenValidationMiddleware.tokenValidationMiddleware, sealingPostController.friendsSealingPosts,pictureController.sendPicture);


module.exports = router;