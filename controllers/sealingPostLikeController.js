const sealingPostLikes=require('../models/sealingPostLikes');

const createSealingPostLike=async(req,res,next)=>{
    try{
        const createLike = await sealingPostLikes.createLike(req.body);
        if(createLike){
            next();
        }
    }
    catch(error){
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteSealingPostLike=async(req,res,next)=>{
    try{
        const deleteLike = await sealingPostLikes.deleteLike(req.body);
        if(deleteLike){
            console.log("hi")
            next();
        }
    }
    catch(error){
        console.error('Error delete like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const showSealingPostLikes=async(req,res,next)=>{
    try{
        const showLikes = await sealingPostLikes.showLikes(req.body);
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

const deletePOstLikes=async(req,res,next)=>{
    try{
        const deletePostLikes = await sealingPostLikes.deletePostLikes(req.body);
        next();
        //res.status(200).json(deleteLike);
    }
    catch(error){
        console.error('Error delete like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {
  createSealingPostLike,
  deleteSealingPostLike,
  showSealingPostLikes,
  deletePOstLikes
};