const postModel=require('../models/sealingPosts');

const addSealingPost=async(req,res)=>{
    try{
        const addSealingPost = await postModel.createSealingPosts(req.body,req.pictureId);
        res.status(200).json(addSealingPost);
    }
    catch(error){
        console.error('Error add Sealing Post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteSealingPost=async(req,res,next)=>{
    try{
        const deleteSealingPost = await postModel.deleteSealingPost(req.body);
        console.log("ghaith"+deleteSealingPost);
        if (deleteSealingPost.picture_id){
            req.deletePost=deleteSealingPost.picture_id;
            console.log(req.deletePost);
            next();
        }
        else{
        res.status(200).json(deleteSealingPost);
        }
    }
    catch(error){
        console.error('Error delete Sealing Post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const profileSealingPosts=async(req,res)=>{
    try{
        const profileSealingPosts = await postModel.profileSealingPosts(req.body);
        res.status(200).json(profileSealingPosts);
    }
    catch(error){
        console.error('Error selecting profile Sealing Posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const friendsSealingPosts = async (req, res, next) => {
  try {
    const postsArray = await postModel.getFriendsSealingPosts(req.body);
    if (postsArray.length > 0 ) {
      req.friendsSealingPostsData = postsArray; // Store the data in the request object
      next();
    } else {
      res.status(200).json(postsArray);
    }
  } catch (error) {
    console.error('Error selecting friends Sealing Posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const editSealingPost=async(req,res)=>{
    try{
        res.status(200).json({ success: true });
        const createPost = await postModel.editSealingPosts(req.body,req.pictureId);
 }
    catch(error){
        console.error('Error adding post:', error);
       // res.status(500).json({ error: 'Internal Server Error' });
    }
}

const selectSealingPost=async(req,res,next)=>{
    try{
        const selectPictureId = await postModel.selectSealingPictureId(req.body);
        if(selectPictureId){
            if(selectPictureId.picture_id){
                req.selectPictureId=selectPictureId.picture_id;
                req.selectPostId=selectPictureId.post_id;
                next();
            }
            else{
                next();
            }
        }
    }
    catch(error){
        console.error('Error selecting edit Post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const increaseSealingPostLike=async(req,res)=>{
    try{
        const increaseLike = await postModel.increaseLike(req.body);
        console.log(increaseLike);
        res.status(200).json({ success: true });
    }
    catch(error){
        console.error('Error increase Like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const decreaseSealingPostLike=async(req,res)=>{
    try{
        const decreaseLike = await postModel.decreaseLike(req.body);
        console.log(decreaseLike);
        res.status(200).json({ success: true });
    }
    catch(error){
        console.error('Error increase Like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const increaseComment=async(req,res,next)=>{
    try{
        const increaseComment = await postModel.increaseComment(req.body);
        next();
    }
    catch(error){
        console.error('Error increase Comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const decreaseComment=async(req,res)=>{
    try{
        const decreaseComment = await postModel.decreaseComment(req.body);
        console.log(decreaseComment);
        res.status(200).json({ success: true });
    }
    catch(error){
        console.error('Error increase Comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    addSealingPost,
    deleteSealingPost,
    profileSealingPosts,
    friendsSealingPosts,
    selectSealingPost,
    editSealingPost,
    increaseSealingPostLike,
    decreaseSealingPostLike,
    decreaseComment,
    increaseComment
};