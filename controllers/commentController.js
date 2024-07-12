const commentModel=require('../models/comments');


const createComment=async(req,res,next)=>{
    try{
        const createComment = await commentModel.createComment(req.body);
        if(createComment){
            req.friendsSealingPostsData=createComment;
            next();
        }
    }
    catch(error){
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteComment=async(req,res,next)=>{
    try{
        const deleteComment = await commentModel.deleteComment(req.body);
        console.log(deleteComment);
        if(deleteComment){
            console.log("hi")
            next();
        }
    }
    catch(error){
        console.error('Error delete comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const showComments=async(req,res,next)=>{
    try{
        const showComments = await commentModel.showComments(req.body);
    if (showComments.length > 0 ) {
      req.friendsSealingPostsData = showComments; // Store the data in the request object
      next();
    } else {
      res.status(200).json(showComments);
    }
    }
    catch(error){
        console.error('Error show comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editComment=async(req,res)=>{
    try{
        const editComment = await commentModel.editComment(req.body);
        res.status(200).json(editComment);
    }
    catch(error){
        console.error('Error edit comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deletePostComment=async(req,res,next)=>{
    try{
        const deletePostComment = await commentModel.deletePostComment(req.body);
        //res.status(200).json(deletePostComment);
        next();
    }
    catch(error){
        console.error('Error delete comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = {
  createComment,
  deleteComment,
  showComments,
  editComment,
  deletePostComment
};