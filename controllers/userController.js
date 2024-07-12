const userModel = require('../models/userModel');

const createUser = async (req, res,next) => {
    try {
        const newUser = await userModel.createUser(req.body,req.pictureId);
        if(newUser){
            req.newUser=newUser.id;
            console.log(req.newUser);
            next();
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const logIn = async (req, res) => {
    try {
        const login = await userModel.logIn(req.body);
        if (login) {
            res.status(200).json(login);
        } else {
            res.status(401).json({ error: 'Invalid login credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateProfile = async (req, res,next) => {
    try {
        console.log(req.pictureId);
        const updateProfile = await userModel.updateProfile(req.newUser,req.pictureId);
        if (updateProfile) {
           req.personalData = updateProfile;
            next();
            //res.status(200).json(updateProfile);
        } else {
            res.status(401).json({ error: 'Invalid login credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const settings = async (req, res) => {
    try {
        const settings = await userModel.settings(req.body);
        res.status(200).json(settings);
    } catch (error) {
        console.error('Error to changing the accounts password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
}

const searchForAccounts=async(req,res,next)=>{
    try {
        const searchForAccounts = await userModel.searchForAccounts(req.body);
        console.log(searchForAccounts)
        if(searchForAccounts){
            req.friendsSealingPostsData=searchForAccounts;
            next();
        }
    } catch (error) {
        console.error('Error to find the account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
}

const changingProfilePicture = async (req, res) => {
    try {
        const changingProfilePicture = await userModel.changingProfilePicture(req.body,req.pictureId);
        res.status(200).json(changingProfilePicture);
    } catch (error) {
        console.error('Error to changing the accounts picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
}


module.exports = {
    createUser,
    logIn,
    settings,
    searchForAccounts,
    changingProfilePicture,
    updateProfile
};