const likeModel=require('../models/likes');

const createLike=async(req,res,next)=>{
    try{
        const createLike = await likeModel.createLike(req.body);
        if(createLike){
            next();
        }
    }
    catch(error){
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteLike=async(req,res,next)=>{
    try{
        const deleteLike = await likeModel.deleteLike(req.body);
        if(deleteLike){
            next();
        }
    }
    catch(error){
        console.error('Error delete like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const showLikes=async(req,res,next)=>{
    try{
        const showLikes = await likeModel.showLikes(req.body);
    if (showLikes.length > 0 ) {
      req.friendsSealingPostsData = showLikes; // Store the data in the request object
      next();
    } else {
      res.status(200).json(showLikes);
    }
    }
    catch(error){
        console.error('Error show like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deletePostLikes=async(req,res,next)=>{
    try{
        const deletePostLikes = await likeModel.deletePostLikes(req.body);
        next();
        //res.status(200).json(deleteLike);
    }
    catch(error){
        console.error('Error delete like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
  createLike,
  deleteLike,
  showLikes,
  deletePostLikes
};