const connection = require('./database');
const mysql = require('mysql2');
//table for likes
const postsTable = `
 CREATE TABLE IF NOT EXISTS posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  content TEXT ,
  likes INT NOT NULL,
  picture_id INT,
  comments INT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
 );
`;

g=connection.query(postsTable, (err) => {
  if (err) {
    console.error('Error creating postsTable:', err);
  } else {
    console.log('postsTable created successfully!');
  }
});


const createPost = async (user,pictureId) => {
  let user_id = parseInt(user.id);
  try {
    const insertResult = await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO posts (user_id, content, likes, picture_id,comments) VALUES (?, ?, ?, ?,?)',
        [user_id, user.content, 0, pictureId,0],
        (err, results) => {
          if (err) {
            console.error('Error creating post:', err);
            reject(err);
          } else {
            console.log('hi4')
            resolve(results);
          }
        }
      );
    });

    if (insertResult.affectedRows > 0) {
      const insertedId = insertResult.insertId;
      const selectResult = await new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM posts WHERE post_id = ?',
          [insertedId],
          (err, results) => {
            if (err) {
              console.error('Error selecting post:', err);
              reject(err);
            } else {
              console.log('hi5')
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
    console.error('Error creating post:', error);
    throw error;
  }
};



const deletePost = async (post) => {
  try {
    let postId=await parseInt(post.postId);
    // First, select the picture_id for the given post_id
    const pictureIdResult = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT picture_id, post_id FROM posts WHERE post_id = ?',
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
    if (pictureIdResult !== null) {
      const deleteResult = await new Promise((resolve, reject) => {
        connection.query(
          'DELETE FROM posts WHERE post_id = ? AND user_id = ?',
          [post.postId, post.id],
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
    } else {
      // If no picture_id is found, return null or handle as needed
      return null;
    }
  } catch (error) {
    console.error('Error in deletePost function:', error);
    throw error;
  }
};


const profilePosts = async (user) => {
  try {
    return await new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM posts WHERE user_id = ?',
        [user.id],
        (err, results) => {
          if (err) {
            console.error('Error selecting posts:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results : null);  
          }
        }
      );
    });
  } catch (error) {
    console.error('Error selecting posts:', error);
    throw error;
  }
};


const getFriendsPosts = async (user) => {
  try {
    return await new Promise((resolve, reject) => {
      const friendsQuery = 'SELECT friend_id FROM friends WHERE user_id = ? AND status = ?';
      const postsQuery = 'SELECT * FROM posts WHERE user_id IN (' + friendsQuery + ')';
      connection.query(postsQuery, [user.id, 't'], (err, results) => { 
        if (err) {
          console.error('Error retrieving friends\' posts:', err);
          reject(err);
        } else {
          resolve(results.length > 0 ? results : null);
        }
      });
    });
  } catch (error) {
    console.error('Error retrieving friends\' posts:', error);
    throw error;
  }
};


const selectPictureId = async (post) => {
  try {
    let postId=await parseInt(post.postId);
    const pictureIdResult = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT picture_id  FROM posts WHERE post_id = ?',
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


const editPost=async(post,pictureId)=>{
  try {
    let postId=await parseInt(post.postId);
    const postUpdateResult = await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE posts SET picture_id=? , content=? WHERE post_id = ?',
        [pictureId,post.content,postId],
        (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve({ success: true });
          }
        }
      );
    });
     return postUpdateResult;
  } catch (error) {
    console.error('Error in update Post function:', error);
    throw error;
  };

}


const increaseLike=async(like)=>{
  try{
    console.log(like.postId)
      await new Promise((resolve, reject) => {
      connection.query(
        'UPDATE posts SET likes = likes + 1 WHERE post_id = ?;',
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
        'UPDATE posts SET likes = likes - 1 WHERE post_id = ?;',
        [like.postId],
        (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            console.log('Hi resolve')
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
        'UPDATE posts SET comments = comments + 1 WHERE post_id = ?;',
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
        'UPDATE posts SET comments = comments - 1 WHERE post_id = ?;',
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
  createPost,
  deletePost,
  profilePosts,
  getFriendsPosts,
  selectPictureId,
  editPost,
  postsTable,
  g,
  increaseLike,
  decreaseLike,
  increaseComment,
  decreaseComment
};