const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tokenValidationMiddleware = require('../middleware/tokenValidationMiddleware');
const pictureController = require('../controllers/pictureController');
const multer = require('multer');
const upload = multer();

router.post('/register',pictureController.upload,userController.createUser,pictureController.addProfilePicture,userController.updateProfile,pictureController.sendPictureProfile);
router.post('/login',upload.none(), userController.logIn);
router.post('/settings',upload.none(), tokenValidationMiddleware.tokenValidationMiddleware, userController.settings);
router.post('/searchForAccounts',pictureController.upload, tokenValidationMiddleware.tokenValidationMiddleware, userController.searchForAccounts,pictureController.sendPicture);
router.post('/changingProfilePicture',pictureController.upload, tokenValidationMiddleware.tokenValidationMiddleware,pictureController.addPicture, userController.changingProfilePicture);
module.exports = router;