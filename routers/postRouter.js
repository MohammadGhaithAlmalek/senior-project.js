const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const pictureController = require('../controllers/pictureController');
const likeController = require('../controllers/likeController');
const commentController = require('../controllers/commentController');
const tokenValidationMiddleware = require('../middleware/tokenValidationMiddleware');
const multer = require('multer');
const upload = multer();
router.post('/createPost',pictureController.upload1,tokenValidationMiddleware.tokenValidationMiddleware,pictureController.addPicture, postController.addPost);
router.post('/deletePost',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware,likeController.deletePostLikes,commentController.deletePostComment, postController.deletePost,pictureController.deletePicture);

router.post('/editPost', pictureController.upload1, tokenValidationMiddleware.tokenValidationMiddleware, postController.selectPost,async(req, res, next) => {
    if (req.selectPictureId&&req.selectPictureId!=-1) {
        console.log('hi')
        console.log(req.selectPictureId)

       await pictureController.editPicture;
    } else {
        console.log('hi')

       await pictureController.addPicture(req,res,next);
    }
            console.log(req.pictureId)
    console.log(' Always go to postController.editPost')
    postController.editPost(req,res,next);

});



module.exports = router;
