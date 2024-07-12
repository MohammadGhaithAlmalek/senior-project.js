const friendsModel = require('../models/friendsModel');

const sendRequest=async(req,res)=>{
    try{
        const sendRequest = await friendsModel.friendRequest(req.body);
        res.status(200).json(sendRequest);
    }
    catch(error){
        console.error('Error sending Request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const acceptFriendRequest=async(req,res)=>{
    try{
        const acceptFriendRequest = await friendsModel.acceptFriendRequest(req.body);
        res.status(200).json(acceptFriendRequest);
    }
    catch(error){
        console.error('Error accept Friend Request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const friendList=async(req,res,next)=>{
    try{
        const friendList = await friendsModel.FriendsList(req.body);
        if(friendList){
            req.friendsSealingPostsData=friendList;
            next();
        }
    }
    catch(error){
        console.error('Error friend List:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const requestFriendsList=async(req,res,next)=>{
    try{
        const requestFriendsList = await friendsModel.requestFriendsList(req.body);
        if(requestFriendsList){
            req.friendsSealingPostsData=requestFriendsList;
            next();
        }
    }
    catch(error){
        console.error('Error request Friends List:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const rejectFriendRequest=async(req,res)=>{
    try{
        const rejectFriendRequest = await friendsModel.rejectFriendRequest(req.body);
        res.status(200).json(rejectFriendRequest);
    }
    catch(error){
        console.error('Error reject Friend Request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const unFriend=async(req,res)=>{
    try{
        const rejectFriendRequest = await friendsModel.unFriend(req.body);
        res.status(200).json(rejectFriendRequest);
    }
    catch(error){
        console.error('Error reject Friend Request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    sendRequest,
    acceptFriendRequest,
    friendList,
    requestFriendsList,
    rejectFriendRequest,
    unFriend
};