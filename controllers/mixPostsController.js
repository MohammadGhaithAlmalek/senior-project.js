const mixPostModel=require('../models/mixPosts');

const profilePosts=async(req,res,next)=>{
    try{
        const profilePosts = await mixPostModel.profilePosts(req.body);
    // Check if the postsArray is not empty and has objects
    if (profilePosts.length > 0 ) {
      req.friendsSealingPostsData = profilePosts;
      next();
    } else {
      res.status(200).json(profilePosts);
    }
    }
    catch(error){
        console.error('Error selecting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const personPosts=async(req,res,next)=>{
    try{
        const profilePosts = await mixPostModel.personPosts(req.body);
    // Check if the postsArray is not empty and has objects
    if (profilePosts.length > 0 ) {
      req.friendsSealingPostsData = profilePosts;
      next();
    } else {
      res.status(200).json(profilePosts);
    }
    }
    catch(error){
        console.error('Error selecting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const profilePostsFinal = async (req, res) => {
  try {
    const postsData = req.postsData;
    if (Array.isArray(postsData) && postsData.length > 0) {
      const [userInformation, ...posts] = postsData;
      res.status(200).json({ userInformation, posts });
    } else {
      // Handle the case where postsData is empty or not an array
      res.status(404).json({ message: 'No posts data found' });
    }
  } catch (error) {
    console.error('Error selecting posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



const friendsPosts=async(req,res,next)=>{
    try{
        const friendsPosts = await mixPostModel.friendsPosts(req.body);
    if (friendsPosts.length > 0 ) {
      req.friendsSealingPostsData = friendsPosts; // Store the data in the request object
      next();
    } else {
      res.status(200).json(friendsPosts);
    }
   } catch(error){
        console.error('Error selecting posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
  profilePosts,
  friendsPosts,
  profilePostsFinal,
  personPosts
};
