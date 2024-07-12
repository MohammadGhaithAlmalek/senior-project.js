const pictureModel = require('../models/pictureModel');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const mime = require('mime-types');
const unlinkAsync = util.promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'postPictures/') // Ensure the uploads directory exists
  },
  filename: function (req, file, cb) {
    // Use the original file name
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage }).any();


const newStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'postPictures/') 
  },
  filename: function (req, file, cb) {

    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload1 = multer({ storage: newStorage }).any();



const addPicture = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    req.pictureId = -1;
    next();
  } 
  else{
          try{
          const fileName = req.files[0].filename;
          const idd = req.body.id;
          console.log(idd)
          const pictureId = await pictureModel.insertPicture(idd, fileName);
          req.pictureId = pictureId;
          console.log(req.pictureId) ;
          next();
              } 
          catch (error) {
          console.error('Error creating user:', error);
          res.status(500).json({ error: 'Internal Server Error' });
    }
    }
}


const addProfilePicture = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    id= 0;
    const fileName = "photo_2024-07-07_22-54-37.jpg";
    const pictureId = await pictureModel.insertPicture(id, fileName);
    req.pictureId = pictureId;
    next();
  } 
  else{
          const fileName = req.files[0].filename;
          const id = req.newUser;
          const pictureId = await pictureModel.insertPicture(id, fileName);
          req.pictureId = pictureId;
          console.log(req.pictureId) ;
          next();
    }
}

const updateProfilePictureId = async (req, res,next) => {
    try{
    id= req.newUser;
    console.log(id)
    picture_id=req.id;
    console.log(picture_id);
    const pictureId = await pictureModel.updateProfilePicture(id, picture_id);
    next();
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editPicture = async (req, res,next) => {
  try {
    //const currentPicture = await pictureModel.deletePicture(deletePost);
    const fileName =await req.files[0].filename;
    const id = await req.body.id;
    const pictureID=await req.selectPictureId;
    
    const pictureName = await pictureModel.selectPicture(pictureID);
    console.log('Delete picture');
    console.log(pictureName);
    await unlinkAsync(`postPictures/${pictureName}`);
    //const pictured = await pictureModel.updatePicture(pictureID);
    const pictureId = await pictureModel.updatePicture(id, fileName,pictureID);
    req.pictureId=pictureId;
    next();
    //res.status(200).send('Picture added successfully.');
  } catch (err) {
    //res.status(500).send('Server error: ' + err.message);
  }
};


const deletePicture=async(req,res)=>{

    try {
    deletePost=req.deletePost.pictureId;
    console.log(deletePost);
    const currentPicture = await pictureModel.deletePicture(deletePost);
    console.log('hi2')
    if (currentPicture) {
      try {
        await unlinkAsync(`postPictures/${currentPicture}`);
        res.status(200).send('Picture deleted successfully.');
      } catch (err) {
        res.status(500).send('File deletion error: ' + err.message);
      }
    } else {
      res.status(404).send('Picture not found.');
    }
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
}

const sendPicture = async (req, res) => {
  try {
    // Assuming req.friendsSealingPostsData is an array of post objects
    const postsData = req.friendsSealingPostsData;
    // Loop through each post to attach the picture URL
    for (let post of postsData) {
      if(post.picture_id || post.user_picture){
        if (post.picture_id && post.user_picture) {
           currentPicture = await pictureModel.selectPicture(post.picture_id);
           userPicture = await pictureModel.selectPicture(post.user_picture);
          post.pictureUrl = `${req.protocol}://${req.get('host')}/postPictures/${currentPicture}`;
          post.pictureUser = `${req.protocol}://${req.get('host')}/postPictures/${userPicture}`;
        }
        else if(post.picture_id && !post.user_picture){
          //post.user_picture = -1;
          currentPicture = await pictureModel.selectPicture(post.picture_id);
          post.pictureUrl = `${req.protocol}://${req.get('host')}/postPictures/${currentPicture}`;
          
        }
        else if(post.user_picture && !post.picture_id){
          post.picture_id = -1;
          userPicture = await pictureModel.selectPicture(post.user_picture);
          post.pictureUser = `${req.protocol}://${req.get('host')}/postPictures/${userPicture}`;}
        else {
          post.pictureUrl = 'Picture not found.';
        }        
      }
       else {
        post.picture_id = -1;
        post.pictureUrl = 'No picture ID provided.';
      }
    }

    res.status(200).json(postsData);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
};

const sendPictureP = async (req, res,next) => {
  try {
    // Assuming req.friendsSealingPostsData is an array of post objects
    const postsData = req.friendsSealingPostsData;
    // Loop through each post to attach the picture URL
    for (let post of postsData) {
      if(post.picture_id || post.user_picture){
        if (post.picture_id && post.user_picture) {
           currentPicture = await pictureModel.selectPicture(post.picture_id);
           userPicture = await pictureModel.selectPicture(post.user_picture);
          post.pictureUrl = `${req.protocol}://${req.get('host')}/postPictures/${currentPicture}`;
          post.pictureUser = `${req.protocol}://${req.get('host')}/postPictures/${userPicture}`;
        }
        else if(post.picture_id && !post.user_picture){
          //post.user_picture = -1;
          currentPicture = await pictureModel.selectPicture(post.picture_id);
          post.pictureUrl = `${req.protocol}://${req.get('host')}/postPictures/${currentPicture}`;
          
        }
        else if(post.user_picture && !post.picture_id){
          post.picture_id = -1;
          userPicture = await pictureModel.selectPicture(post.user_picture);
          post.pictureUser = `${req.protocol}://${req.get('host')}/postPictures/${userPicture}`;}
        else {
          post.pictureUrl = 'Picture not found.';
        }        
      }
       else {
        post.picture_id = -1;
        post.pictureUrl = 'No picture ID provided.';
      }
    }
    req.postsData=postsData;
    next();
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
};

const sendPictureProfile = async (req, res) => {
  try {
    // Assuming req.friendsSealingPostsData is an array of post objects
    const personalData = req.personalData;
    // Loop through each post to attach the picture URL
   console.log(personalData);
      if( personalData.picture_id){
           userPicture = await pictureModel.selectPicture(personalData.picture_id);
          personalData.pictureUser = `${req.protocol}://${req.get('host')}/postPictures/${userPicture}`;
        }       
       else {
        personalData.picture_id = -1;
        personalData.pictureUrl = 'No picture ID provided.';
      }
      
    res.status(200).json(personalData);
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
};

module.exports = {
  addPicture,
  editPicture,
  upload1,
  deletePicture,
  sendPicture,
  upload,
  addProfilePicture,
  updateProfilePictureId,
  sendPictureP,
  sendPictureProfile
};