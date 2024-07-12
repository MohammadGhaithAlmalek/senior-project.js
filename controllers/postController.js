const postModel=require('../models/posts');

const addPost=async(req,res)=>{
    try{
        console.log(req.pictureId)
        const createPost = await postModel.createPost(req.body,req.pictureId);
        res.status(200).json(createPost);
 }
    catch(error){
        console.error('Error adding post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

const deletePost=async(req,res,next)=>{
    try{
        const deletePost = await postModel.deletePost(req.body);
        if (deletePost.picture_id){
            req.deletePost=deletePost.picture_id;
            next();
        }
        else{
        res.status(200).json({ success: true });
        }
    }
    catch(error){
        console.error('Error delete post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const profilePosts=async(req,res)=>{
    try{
        const profilePosts = await postModel.profilePosts(req.body);
        res.status(200).json(profilePosts);
    }
    catch(error){
        console.error('Error selecting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const friendsPosts=async(req,res)=>{
    try{
        const getFriendsPosts = await postModel.getFriendsPosts(req.body);
        res.status(200).json(getFriendsPosts);
    }
    catch(error){
        console.error('Error selecting friend posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const selectPost=async(req,res,next)=>{
    try{
        const selectPictureId = await postModel.selectPictureId(req.body);
        console.log('hi')
        console.log(selectPictureId)
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
        //res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editPost=async(req,res,next)=>{
    try{
        console.log(req.pictureId)
        res.status(200).json({ success: true });
        const createPost = await postModel.editPost(req.body,req.pictureId);
 }
    catch(error){
        console.error('Error adding post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}

const increaseLike=async(req,res)=>{
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

const decreaseLike=async(req,res)=>{
    try{
        const decreaseLike = await postModel.decreaseLike(req.body);
        console.log(decreaseLike);
        res.status(200).json({ success: true });
    }
    catch(error){
        console.error('Error decrease Like:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const increaseComment=async(req,res,next)=>{
    try{
        const increaseComment = await postModel.increaseComment(req.body);
        next();
        //res.status(200).json(req.commentContent);
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
    addPost,
    deletePost,
    profilePosts,
    friendsPosts,
    selectPost,
    editPost,
    increaseLike,
    decreaseLike,
    increaseComment,
    decreaseComment
};