const connection = require('./database');
const mysql = require('mysql2');

const commentsTable = `CREATE TABLE IF NOT EXISTS sealingPostComments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES sealingPosts(post_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
  );`
;


connection.query(commentsTable, (err) => {
  if (err) {
    console.error('Error creating comment table:', err);
  } else {
    console.log('comment table created successfully!');
  }
});

const createComment = async(comment)=>{
  try {
    const insertResult= await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO sealingPostComments (post_id, user_id,content) VALUES (?, ?, ?)',
        [comment.postId, comment.id,comment.content],
        (err, results) => {
          if (err) {
            console.error('Error creating comment:', err);
            reject(err);
          } else {
              resolve(results);

          }
        }
      );
    });
        if (insertResult.affectedRows > 0) {
        const insertedId = insertResult.insertId;
        const selectResult = await new Promise((resolve, reject) => {
        connection.query(
          'SELECT c.*, u.picture_id, u.name FROM sealingPostComments c JOIN users u ON c.user_id = u.id WHERE c.comment_id = ? ',
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
      const combinedResults = [selectResult];
      return combinedResults;
        } else {
      return null;
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

const deleteComment = async (comment) => {
  try {
    iD=parseInt(comment.postId)
    return await new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM sealingPostComments
        WHERE post_id=? AND user_id=? AND comment_id=?
      `;
      connection.query(sql, [iD,comment.id,comment.commentId], (err, results) => {
        if (err) {
          console.error('Error deleting comment:', err);
          reject(err);
        } else {
          resolve(results.affectedRows > 0 ? { success: true } : null);
        }
      });
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

const showComments = async (comment) => {
    try {
        return await new Promise((resolve, reject) => {
            connection.query(
                'SELECT c.*, u.picture_id, u.name FROM sealingPostComments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC',
                [comment.postId],
                (err, results) => {
                    if (err) {
                        console.error('Error viewing comments:', err);
                        reject(err);
                    } else {
                        resolve(results); // Return comments with user details
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error viewing comments:', error);
        throw error;
    }
};

const editComment =async(comment)=>{
  try {
    commentID=parseInt(comment.postId)
    ID=parseInt(comment.id)
    return await new Promise((resolve, reject) => {
      const sql = 'UPDATE sealingPostComments SET content = ? WHERE post_id = ? AND user_id = ? AND comment_id=?';
      connection.query(sql, [comment.newContent, commentID, ID,comment.commentId], (err, results) => {
        if (err) {
          console.error('Error updating comment:', err);
          reject(err);
        } else {
          resolve(results.affectedRows > 0 ? { success: true } : null);
        }
      });
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};


const deletePostComment = async (comment) => {
  try {
    iD=parseInt(comment.postId)
    return await new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM sealingPostComments
        WHERE post_id=? 
      `;
      connection.query(sql, [iD], (err, results) => {
        if (err) {
          console.error('Error deleting comment:', err);
          reject(err);
        } else {
          resolve(results.affectedRows > 0 ? { success: true } : null);
        }
      });
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

module.exports = {
  createComment,
  deleteComment,
  showComments,
  editComment,
  deletePostComment
};