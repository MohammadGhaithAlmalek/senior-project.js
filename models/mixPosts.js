const g = require('./posts');
const s = require('./sealingPosts');
const picture=require('../controllers/pictureController')

const connection = require('./database');
connection.g;
connection.s;

const profilePosts = async (user) => {
  try {
    const sealingPostsQuery = `
      SELECT
        sp.post_id,
        u.id AS user_id,
        u.name AS name,
        sp.description,
        sp.phone_number,
        sp.price,
        sp.type_of_price,
        sp.picture_id,
        sp.likes,
        sp.timestamp,
        IF(l.user_id IS NOT NULL, TRUE, FALSE) AS user_liked
      FROM sealingPosts sp
      INNER JOIN users u ON sp.user_id = u.id
      LEFT JOIN sealingPostlikes l ON sp.post_id = l.post_id AND l.user_id = ?
      WHERE u.id=?;
    `;
    const sealingPostsResults = await new Promise((resolve, reject) => {
      connection.query(sealingPostsQuery, [user.id,user.id], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
      // Query to select all sealing posts from friends
     const postsQuery = `
      SELECT
        sp.post_id,
        u.id AS user_id,
        u.name AS name, 
        sp.content,
        sp.likes,
        sp.picture_id,
        sp.timestamp,
        IF(l.user_id IS NOT NULL, TRUE, FALSE) AS user_liked
        FROM posts sp
        INNER JOIN users u ON sp.user_id = u.id
        LEFT JOIN likes l ON sp.post_id = l.post_id AND l.user_id = ?
        WHERE u.id=?; 
    `;
    const postsResults = await new Promise((resolve, reject) => {
      connection.query(postsQuery, [user.id,user.id], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

     const userQuery = `
      SELECT
        name,
        id,
        bio, 
        picture_id as user_picture
        FROM users
        WHERE id=?; 
    `;
    const userResult = await new Promise((resolve, reject) => {
      connection.query(userQuery, [user.id], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  const combinedResults = [...postsResults, ...sealingPostsResults];
  const r=combinedResults.sort((a, b) => b.timestamp - a.timestamp);
  const finalResult=[...userResult,...r];
  return finalResult;
  } catch (error) {
    console.error('Error retrieving friends\' posts:', error);
    throw error;
  }
};


const personPosts = async (user) => {
  try {
    const sealingPostsQuery = `
      SELECT
        sp.post_id,
        u.id AS user_id,
        u.name AS name,
        sp.description,
        sp.phone_number,
        sp.price,
        sp.type_of_price,
        sp.picture_id,
        sp.likes,
        sp.timestamp,
        IF(l.user_id IS NOT NULL, TRUE, FALSE) AS user_liked
      FROM sealingPosts sp
      INNER JOIN users u ON sp.user_id = u.id
      LEFT JOIN sealingPostlikes l ON sp.post_id = l.post_id AND l.user_id = ?
      WHERE u.id=?;
    `;
    const sealingPostsResults = await new Promise((resolve, reject) => {
      connection.query(sealingPostsQuery, [user.personId,user.personId], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
      // Query to select all sealing posts from friends
     const postsQuery = `
      SELECT
        sp.post_id,
        u.id AS user_id,
        u.name AS name, 
        sp.content,
        sp.likes,
        sp.picture_id,
        sp.timestamp,
        IF(l.user_id IS NOT NULL, TRUE, FALSE) AS user_liked
        FROM posts sp
        INNER JOIN users u ON sp.user_id = u.id
        LEFT JOIN likes l ON sp.post_id = l.post_id AND l.user_id = ?
        WHERE u.id=?; 
    `;
    const postsResults = await new Promise((resolve, reject) => {
      connection.query(postsQuery, [user.personId,user.personId], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

     const userQuery = `
      SELECT
        name,
        id,
        bio, 
        picture_id as user_picture
        FROM users
        WHERE id=?; 
    `;
    const userResult = await new Promise((resolve, reject) => {
      connection.query(userQuery, [user.personId], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
      const friendsQuery = `    SELECT u1.id as user_id, u1.name as user_name, u2.id as friend_id, u2.name as friend_name, f.status 
    FROM friends f 
    JOIN users u1 ON u1.id = f.user_id 
    JOIN users u2 ON u2.id = f.friend_id 
    WHERE f.status = 't' AND (f.friend_id = ? OR f.user_id = ?) AND (f.friend_id = ? OR f.user_id = ?)`;
          const friendsValues = [user.id, user.id,user.personId,user.personId];
    let friendList; 
    let isFriends=false;
    const friendsResults = await new Promise((resolve, reject) => {
      connection.query(friendsQuery, friendsValues, (error, results) => {
        if (error) {
          console.error('Error fetching friends list: ', error);
          reject(error);
        } else {
          // Map the results to friendList here
          friendList = results.map((row) => {
            const friendId = row.user_id == user.id ? row.friend_id : row.user_id;
            return  {id: friendId} ;
          });
          console.log(friendList)
          if (friendList.length > 0){
            isFriends=true;
          }
          else{
            isFriends=false;
          }
          resolve(results);
        }
      });
    });
 const combinedResults = [...postsResults, ...sealingPostsResults];
 const r = combinedResults.sort((a, b) => b.timestamp - a.timestamp);
 const mergedResult = {
  ...userResult[0], // Assuming userResult is an array with a single user object
  isFriend: isFriends,
 };
 const finalResult = [mergedResult, ...r];
 return finalResult;

  } catch (error) {
    console.error('Error retrieving friends\' posts:', error);
    throw error;
  }
};




const friendsPosts = async (user) => {
  try {
      // Query to get friend IDs
      const friendsQuery = `    SELECT u1.id as user_id, u1.name as user_name, u2.id as friend_id, u2.name as friend_name, f.status 
    FROM friends f 
    JOIN users u1 ON u1.id = f.user_id 
    JOIN users u2 ON u2.id = f.friend_id 
    WHERE f.status = 't' AND (f.friend_id = ? OR f.user_id = ?)`;
          const friendsValues = [user.id, user.id];
    let friendList; // Define friendList outside of the promise
    const friendsResults = await new Promise((resolve, reject) => {
      connection.query(friendsQuery, friendsValues, (error, results) => {
        if (error) {
          console.error('Error fetching friends list: ', error);
          reject(error);
        } else {
          // Map the results to friendList here
          friendList = results.map((row) => {
            const friendId = row.user_id == user.id ? row.friend_id : row.user_id;
            return { id: friendId };
          });
          console.log(friendList);
          resolve(results);
        }
      });
    });

    // Ensure friendList is defined before using it
    if (!friendList) {
      throw new Error('friendList is not defined');
    }
      // Query to select all sealing posts from friends
     const sealingPostsQuery = `
      SELECT
        sp.post_id,
        u.id AS user_id,
        u.name AS name,
        sp.description,
        sp.phone_number,
        sp.price,
        u.picture_id as user_picture,
        sp.type_of_price,
        sp.picture_id,
        sp.likes,
        sp.timestamp,
        IF(l.user_id IS NOT NULL, TRUE, FALSE) AS user_liked
        FROM sealingPosts sp
        INNER JOIN users u ON sp.user_id = u.id
        LEFT JOIN sealingPostlikes l ON sp.post_id = l.post_id AND l.user_id = ?
        WHERE u.id IN (?); 
    `;
    // Use the map function to extract the ids from friendList
    const friendIds = friendList.map(friend => friend.id);
    const sealingPostsResults = await new Promise((resolve, reject) => {
      connection.query(sealingPostsQuery, [user.id,friendIds], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
      // Query to select all sealing posts from friends
     const postsQuery = `
      SELECT
        sp.post_id,
        u.name AS name,
        u.id AS user_id,
        u.picture_id as user_picture,
        sp.content,
        sp.likes,
        sp.picture_id,
        sp.timestamp,
        IF(l.user_id IS NOT NULL, TRUE, FALSE) AS user_liked
        FROM posts sp
        INNER JOIN users u ON sp.user_id = u.id
        LEFT JOIN likes l ON sp.post_id = l.post_id AND l.user_id = ?
        WHERE u.id IN (?); 
    `;
    const postsResults = await new Promise((resolve, reject) => {
      connection.query(postsQuery, [user.id,friendIds], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  const combinedResults = [...postsResults, ...sealingPostsResults];
  console.log(combinedResults);
  const r=combinedResults.sort((a, b) => b.timestamp - a.timestamp);
  const finalResult=[...r];
  return finalResult;
  } catch (error) {
    console.error('Error retrieving friends\' posts:', error);
    throw error;
  }
}

//transfer there pictures

module.exports = {
    profilePosts,
    friendsPosts,
    personPosts 
};