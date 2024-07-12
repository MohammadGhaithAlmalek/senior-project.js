const connection = require('./database');
const mysql = require('mysql2');


const likesTable = `CREATE TABLE IF NOT EXISTS likes (
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;


connection.query(likesTable, (err) => {
  if (err) {
    console.error('Error creating like table:', err);
  } else {
    console.log('likes table created successfully!');
  }
});  


const createLike = async(like)=>{
  try {
    return await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [like.postId, like.id],
        (err, results) => {
          if (err) {
            console.error('Error creating like:', err);
            reject(err);
          } else {
              resolve( { success: true } );
          }
        }
      );
    });
  } catch (error) {
    console.error('Error creating like:', error);
    throw error;
  }
};


const deleteLike = async (like) => {
  try {
    iD=parseInt(like.postId)
    return await new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM likes
        WHERE post_id=? AND user_id=? 
      `;
      connection.query(sql, [iD,like.id], (err, results) => {
        if (err) {
          console.error('Error deleting like:', err);
          reject(null);
        } else {
          resolve( { success: true } );
        }
      });
    });
  } catch (error) {
    console.error('Error deleting like:', error);
    throw error;
  }
};


const showLikes = async (like) => {
  try {
    // Fetch user IDs who liked the post
    const likeResults = await new Promise((resolve, reject) => {
      connection.query(
        'SELECT user_id FROM likes WHERE post_id = ?',
        [like.postId],
        (err, results) => {
          if (err) {
            console.error('Error fetching likes:', err);
            reject(err);
          } else {
            const userIds = results.map((row) => row.user_id);
            resolve(userIds);
          }
        }
      );
    });

    if (likeResults.length === 0) {
      // Handle case when no likes are found
      return [];
    }

    // Fetch user details based on user IDs
    const userDetails = await new Promise((resolve, reject) => {
      const query = 'SELECT name, picture_id FROM users WHERE id IN (?)';
      connection.query(query, [likeResults], (err, userResults) => {
        if (err) {
          console.error('Error fetching user details:', err);
          reject(err);
        } else {
          resolve(userResults); // Returns an array of user details
        }
      });
    });

    return userDetails;
  } catch (error) {
    console.error('Error in showLikes:', error);
    throw error;
  }
};



const deletePostLikes = async (like) => {
  try {
    iD=parseInt(like.postId)
    return await new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM likes
        WHERE post_id=? 
      `;
      connection.query(sql, [iD], (err, results) => {
        if (err) {
          console.error('Error deleting like:', err);
          reject(err);
        } else {
          resolve(results.affectedRows > 0 ? { success: true } : null);
        }
      });
    });
  } catch (error) {
    console.error('Error deleting like:', error);
    throw error;
  }
};


module.exports = {
  createLike,
  deleteLike,
  showLikes,
  deletePostLikes
};