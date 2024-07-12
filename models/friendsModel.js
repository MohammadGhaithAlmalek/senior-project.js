const connection = require('./database');
const mysql = require('mysql2');

const friendsTable = `
 CREATE TABLE IF NOT EXISTS friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
 );` ;




 connection.query(friendsTable, (err) => {
  if (err) {
    console.error('Error creating friendsTable:', err);
  } else {
    console.log('friendsTable created successfully!');
  }
});

connection.query(friendsTable, (err) => {
  if (err) {
    console.error('Error creating friend table:', err);
  } else {
    console.log('friend table created successfully!');
  }
});

const friendRequest = async (user) => {
    try {
        let user_id = parseInt(user.id);
        let friend_id = parseInt(user.friend_id);
        const existingRequest = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT * FROM friends WHERE user_id = ? AND friend_id = ?',
                [user_id,friend_id],
                (err, result) => {
                    if (err) {
                        console.error('Error checking existing friend request: ', err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
        if (existingRequest.length > 0) {
            console.log('Friend request already sent.');
            return;
        }
        await new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
                [user_id, friend_id, 'r'],
                (err, result) => {
                    if (err) {
                        console.error('Error creating friend request: ', err);
                        reject(err);
                    } else {
                        console.log('Friend request sent successfully.');
                        resolve(result.affectedRows > 0 ? { success: true} : null);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error creating friend request: ', error);
    }
};

const requestFriendsList = async (user) => {
  try {
    
    const query = `
      SELECT u1.id as user_id, u1.name as user_name,u1.picture_id as picture_id1, u2.id as friend_id, u2.name as friend_name, u2.picture_id as picture_id2 , f.status 
      FROM friends f 
      JOIN users u1 ON u1.id = f.user_id 
      JOIN users u2 ON u2.id = f.friend_id 
      WHERE f.status = 'r' AND (f.friend_id = ? OR f.user_id = ?)
    `;

    const values = [user.id, user.id];

    const friendsResults = await new Promise((resolve, reject) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Error fetching friends list: ', error);
          reject(error);
        } else {
          const friendList = results.map((row) => {
            const friendId = row.user_id == user.id ? row.friend_id : row.user_id;
            const friendName = row.user_id == user.id ? row.friend_name : row.user_name;
            const picture_id = row.user_id == user.id ? row.picture_id2 : row.picture_id1;
            return { id: friendId, name: friendName, picture_id: picture_id };
          });
          resolve(friendList);
        }
      });
    });
    return friendsResults;
  } catch (error) {
    console.error('Error fetching friends list: ', error);
  }
};

const FriendsList = async (user) => {
  try {
    const query = `
      SELECT u1.id as user_id, u1.name as user_name,u1.picture_id as picture_id1, u2.id as friend_id, u2.name as friend_name,u2.picture_id as picture_id2, f.status 
      FROM friends f 
      JOIN users u1 ON u1.id = f.user_id 
      JOIN users u2 ON u2.id = f.friend_id 
      WHERE f.status = 't' AND (f.friend_id = ? OR f.user_id = ?)
    `;

    const values = [user.id, user.id];

    const friendsResults = await new Promise((resolve, reject) => {
      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Error fetching friends list: ', error);
          reject(error);
        } else {
          const friendList = results.map((row) => {
            const friendId = row.user_id == user.id ? row.friend_id : row.user_id;
            const friendName = row.user_id == user.id ? row.friend_name : row.user_name;
            const picture_id = row.user_id == user.id ? row.picture_id2 : row.picture_id1;
            return { id: friendId, name: friendName , picture_id: picture_id };
          });
          resolve(friendList);
        }
      });
    });
    return friendsResults;
  } catch (error) {
    console.error('Error fetching friends list: ', error);
  }
};

const acceptFriendRequest = async (user) => {
  try {
    let request_id = parseInt(user.friend_id);
    let player_id = parseInt(user.id);
    const sq = "UPDATE friends SET status = 't' WHERE user_id = ? AND friend_id = ?";
    const values = [request_id, player_id];

    const result = await new Promise((resolve, reject) => {
      connection.query(sq, values, (error, results, fields) => {
        if (error) {
          console.error('Error updating friendship status:', error);
          reject(error);
        } else {
          console.log("Friendship status updated!");
          resolve(results.affectedRows > 0 ? { success: true} : null);
        }
      });
    });
     return result;
  } catch (error) {
    console.error('Error in deletePost function:', error);
    throw error;
  }
};

const rejectFriendRequest = async (user) => {
  try {
    let request_id = parseInt(user.friend_id);
    let player_id = parseInt(user.id);
    const sql = "DELETE FROM friends WHERE user_id = ? AND friend_id = ? AND status = ?";
    const values = [request_id, player_id,"r"];

    const result = await new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.error('Error deleting friend request:', error);
          reject(error);
        } else {
          console.log("Friend request successfully deleted!");
          resolve(results.affectedRows > 0 ? { success: true} : null);
        }
      });
    });
     return result;
 }
 catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }

}

const unFriend = async (user) => {
  try {
    let request_id = parseInt(user.friend_id);
    let player_id = parseInt(user.id);
    const sql = `
        DELETE FROM friends 
        WHERE (user_id = ? AND friend_id = ? AND status = ?) 
           OR (user_id = ? AND friend_id = ? AND status = ?)
      `;
    const values = [request_id, player_id,'t', player_id, request_id, 't'];

    const result = await new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results, fields) => {
        if (error) {
          console.error('Error deleting friend request:', error);
          reject(error);
        } else {
          console.log("Friend request successfully deleted!");
          resolve(results.affectedRows > 0 ? { success: true} : null);
        }
      });
    });
     return result;
 }
 catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }

}


module.exports = {
  friendRequest,
  FriendsList, 
  requestFriendsList,
  acceptFriendRequest,
  rejectFriendRequest,
  unFriend
};