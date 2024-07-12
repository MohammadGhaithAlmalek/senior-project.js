const connection = require('./database');
const mysql = require('mysql2');

const sealingPostsTable = `
 CREATE TABLE IF NOT EXISTS sealingPosts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  description TEXT NOT NULL,
  phone_number VARCHAR(20),
  price DECIMAL(10, 2) ,
  type_of_price VARCHAR(20),
  likes INT NOT NULL,
  comments INT NOT NULL,
  picture_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
 );
`;

s=connection.query(sealingPostsTable, (err) => {
  if (err) {
    console.error('Error creating sealingPosts Table:', err);
  } else {
    console.log('sealingPosts Table created successfully!');
  }
});


const createSealingPosts = async (user,pictureId) => {
  try {
    let user_id = parseInt(user.id);
    const insertResult = await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO sealingPosts (user_id, description,phone_number,price,type_of_price,likes,comments,picture_id) VALUES (?, ?,?,?,?,?,?,?)',
        [user_id, user.description,user.phone_number,user.price,user.type_of_price,0,0,pictureId],
        (err, results) => {
          if (err) {
            console.error('Error creating post:', err);
            reject(err);
          } else {
            //console.log(results);
            resolve(results);

          }
        }
      );
    });
    if (insertResult.affectedRows > 0) {
      const insertedId = insertResult.insertId;
      //console.log(insertedId)
      const selectResult = await new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM sealingPosts WHERE post_id = ?',
          [insertedId],
          (err, results) => {
            if (err) {
              console.error('Error selecting post:', err);
              reject(err);
            } else {
              //console.log('hi5')
              resolve(results.length > 0 ? results[0] : null);
            }
          }
        );
      });
      
      return selectResult;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error creating Sealing post:', error);
    throw error;
  }
};


const deleteSealingPost = async (post) => {
  try {
    let postId=await parseInt(post.postId);
    const pictureIdResult = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT picture_id, post_id FROM sealingPosts WHERE post_id = ?',
        [postId],
        (err, results) => {
          if (err) {
            console.error('Error selecting picture_id:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results[0] : null);
            console.log(results[0]);
          }
        }
      );
    });
    // If a picture_id is found, delete the post
      const deleteResult = await new Promise((resolve, reject) => {
        connection.query(
          'DELETE FROM sealingPosts WHERE post_id = ? AND user_id = ?',
          [postId, post.id],
          (err, results) => {
            if (err) {
              console.error('Error deleting post:', err);
              reject(err);
            } else {
              resolve(results.affectedRows > 0 ? { success: true, pictureId: pictureIdResult.picture_id } : null);
            }
          }
        );
      });
      console.log(deleteResult);
      return deleteResult;
  } catch (error) {
    console.error('Error in deletePost function:', error);
    throw error;
  }
};


const profileSealingPosts = async (user) => {
  try {
    return await new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM sealingPosts WHERE user_id = ?',
        [user.id],
        (err, results) => {
          if (err) {
            console.error('Error selecting Sealing Posts:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results : null);  
          }
        }
      );
    });
  } catch (error) {
    console.error('Error selecting Sealing Posts:', error);
    throw error;
  }
};


const getFriendsSealingPosts = async (user) => {
  try {
    // Fetch the friends list with 't' status
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

    // Fetch the sealing posts for each friend
     const sealingPostsQuery = `
      SELECT
        sp.post_id,
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
    //console.log(friendIds);
    const postsResults = await new Promise((resolve, reject) => {
      connection.query(sealingPostsQuery, [user.id,friendIds], (error, results) => {
        if (error) {
          console.error('Error fetching sealing posts: ', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  const combinedResults = [...postsResults];
  const r=combinedResults.sort((a, b) => b.timestamp - a.timestamp);
  const finalResult=[...r];
  return finalResult;
  } catch (error) {
    console.error('Error in getFriendsSealingPosts function: ', error);
    throw error;
  }
};



const editSealingPosts = async (post,pictureId) => {
  try {
    let postId=await parseInt(post.postId);
    const postUpdateResult = await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE sealingPosts SET picture_id=? , description=?,phone_number=?,price=?,type_of_price=? WHERE post_id = ?',
        [pictureId,post.description,post.phone_number,post.price,post.type_of_price,postId],
        (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            console.log('finish')
            resolve(results.length > 0 ? results[0] : null);
          }
        }
      );
    });
     return postUpdateResult;
  } catch (error) {
    console.error('Error in update Post function:', error);
    throw error;
  };

};


const selectSealingPictureId = async (post) => {
  try {
    let postId=await parseInt(post.postId);
    const pictureIdResult = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT picture_id  FROM sealingPosts WHERE post_id = ?',
        [postId],
        (err, results) => {
          if (err) {
            console.error('Error selecting picture_id:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        }
      );
    });
      //console.log(pictureIdResult);
      return pictureIdResult;
  } catch (error) {
    console.error('Error in deletePost function:', error);
    throw error;
  };

};

const increaseLike=async(like)=>{
  try{
    console.log(like.postId)
      await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE sealingPosts SET likes = likes + 1 WHERE post_id = ?;',
        [like.postId],
        (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? true  : null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in update Post function:', error);
    throw error;
  };

}

const decreaseLike=async(like)=>{
  try{
    console.log(like.postId)
      await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE sealingPosts SET likes = likes - 1 WHERE post_id = ?;',
        [like.postId],
        (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? true  : null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in update Post function:', error);
    throw error;
  };

}

const increaseComment=async(comments)=>{
  try{
      await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE sealingPosts SET comments = comments + 1 WHERE post_id = ?;',
        [comments.postId],
        (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? true  : null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in update Post function:', error);
    throw error;
  };

}

const decreaseComment=async(comments)=>{
  try{
      await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE sealingPosts SET comments = comments - 1 WHERE post_id = ?;',
        [comments.postId],
        (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? true  : null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in update Post function:', error);
    throw error;
  };

}


module.exports = {
  createSealingPosts,
  deleteSealingPost,
  profileSealingPosts,
  getFriendsSealingPosts,
  editSealingPosts,
  s,
  selectSealingPictureId,
  increaseLike,
  decreaseLike,
  increaseComment,
  decreaseComment
};