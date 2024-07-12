const connection = require('./database');
const mysql = require('mysql2');


const likesTable = `CREATE TABLE IF NOT EXISTS sealingPostLikes (
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES sealingPosts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;


connection.query(likesTable, (err) => {
  if (err) {
    console.error('Error creating sealing Post Likes table:', err);
  } else {
    console.log(' sealing Post Likes created successfully!');
  }
});  


const createLike = async(like)=>{
  try {
    return await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO sealingPostLikes (post_id, user_id) VALUES (?, ?)',
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
    postId=parseInt(like.postId)
    iD=parseInt(like.id)
    console.log(like)
    return await new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM sealingPostLikes
        WHERE post_id=? AND user_id=? 
      `;
      connection.query(sql, [postId,iD], (err, results) => {
        if (err) {
          console.error('Error deleting like:', err);
          reject(null);
        } else {
          resolve( { success: true });
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
    return await new Promise((resolve, reject) => {
      connection.query(
        'SELECT user_id FROM sealingPostLikes WHERE post_id = ?',
        [like.postId],
        (err, results) => {
          if (err) {
            console.error('Error viewing comments:', err);
            reject(err);
          } else {
            const userIds = results.map((row) => row.user_id);
            // Check if userIds array is not empty
            if (userIds.length > 0) {
              const query = 'SELECT name, picture_id FROM users WHERE id IN (?)';
              connection.query(query, [userIds], (err, userResults) => {
                if (err) {
                  console.error('Error fetching user details:', err);
                  reject(err);
                } else {
                  resolve(userResults);
                }
              });
            } else {
              // Handle the case when no user IDs are found
              resolve([]);
            }
          }
        }
      );
    });
  } catch (error) {
    console.error('Error viewing comments:', error);
    throw error;
  }
};

const deletePostLikes = async (like) => {
  try {
    iD=parseInt(like.postId)
    return await new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM sealingPostLikes
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
