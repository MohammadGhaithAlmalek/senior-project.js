const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const tokenValidationMiddleware = require('../middleware/tokenValidationMiddleware');
const pictureController = require('../controllers/pictureController');
const multer = require('multer');
const upload = multer();


router.post('/sendFriendRequest',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware, friendController.sendRequest);
router.post('/acceptFriendRequest',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware, friendController.acceptFriendRequest);
router.post('/rejectFriendRequest',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware, friendController.rejectFriendRequest);
router.post('/unFriend',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware, friendController.unFriend);

router.post('/friendList',pictureController.upload, tokenValidationMiddleware.tokenValidationMiddleware, friendController.friendList,pictureController.sendPicture);
router.post('/requestFriendsList',pictureController.upload, tokenValidationMiddleware.tokenValidationMiddleware, friendController.requestFriendsList,pictureController.sendPicture);

module.exports = router;