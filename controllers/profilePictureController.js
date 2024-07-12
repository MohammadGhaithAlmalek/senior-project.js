const profilePictureModel = require('../models/profilePictureModel');
const multer = require('multer');
const path = require('path'); // Make sure to require the path module

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profilePictures/') // Ensure the uploads directory exists
  },
  filename: function (req, file, cb) {
    // Use the original file extension
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage }).any();

const addPicture = async (req, res) => {
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(500).send('Multer error: ' + err.message);
      } else if (err) {
        // An unknown error occurred.
        res.status(500).send('Unknown error: ' + err.message);
      } else {
        // Everything went fine, process the files
        if (req.files) {
          const fileName=req.files[0].filename;
          const id=req.body.id  
          const insertPicture=profilePictureModel.insertProfilePicture(id,fileName);
          const filesInfo = req.files.map(file => `${file.fieldname}: ${file.filename}`);
          res.status(200).send(`Files uploaded successfully: ${filesInfo.join(', ')}`);
        } else {
          res.status(400).send('No files uploaded');
        }
      }
    });
  } catch (err) {
    // Handle unexpected errors
    res.status(500).send('Server error: ' + err.message);
  }
};

module.exports = {
  addPicture
};
