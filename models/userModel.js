const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const connection = require('./database');
const serverKey="71b1375d5c2d1dc4db0206d061e2b8ec39fd63e85500b92e8c11f7d1d04a55d1";



// Define the user table schema
const userTable = `CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,
  token VARCHAR(255),
  expires_at DATETIME NOT NULL,
  picture_id INT,
  bio VARCHAR(300),
  UNIQUE (token)
);`
;

// Create the user table if it does not exist
connection.query(userTable, (err) => {
  if (err) {
    console.error('Error creating user table:', err);
  } else {
    console.log('User table created successfully!');
  }
});

const SyriaTime = async () => {
  return new Promise((resolve, reject) => {
    try {
      var date = new Date();
      var timeOffset = 3;
      date.setHours(date.getHours() + timeOffset);
      var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'Asia/Damascus'
      };
      const formattedTime = date.toLocaleString('en-US', options);
      resolve(new Date(formattedTime)); // Convert formatted time to a Date object
    } catch (error) {
      reject(error);
    }
  });
};

 const encryptToken = async(token) => {
     const iv = Buffer.from('88a4f04d05e65de12c8907e2b5e8c7a1', 'hex');
     const cipher = crypto.createCipheriv('aes-256-cbc',  Buffer.from(serverKey, 'hex'), iv);
     let encryptedToken = cipher.update(token, 'utf8', 'hex');
     encryptedToken += cipher.final('hex');
     return encryptedToken;
 };

 const decryptToken = async(encryptedToken) => {
     const iv = Buffer.from('88a4f04d05e65de12c8907e2b5e8c7a1', 'hex');
     const decipher = crypto.createDecipheriv('aes-256-cbc',  Buffer.from(serverKey, 'hex'), iv);
     let decryptedData = decipher.update(encryptedToken, 'hex', 'utf8');
     decryptedData += decipher.final('utf8');
     return decryptedData;
 };

const generateToken = async () => {
  try {
    const tokenLength = 32;
    const randomTokenBuffer = crypto.randomBytes(tokenLength);
    const token = randomTokenBuffer.toString('base64');

    const keyLength = 32; // 256 bits for AES-256
    const randomKeyBuffer = crypto.randomBytes(keyLength);
    const key = randomKeyBuffer.toString('base64');

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30); // Set expiration time to 1 hour from now

    return { token, key, expiresAt: expirationTime };
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};


const cryptPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Hashed Password:', hashedPassword);
    return hashedPassword;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
};

const comparePassword = async (plainPass, hashedPass) => {
  try {
    const isMatch = await bcrypt.compare(plainPass, hashedPass);
    console.log('Password Match:', isMatch);
    return isMatch;
  } catch (err) {
    console.error('Error comparing passwords:', err);
    throw err; 
  }
};


const createUser = async (user,pictureId) => {
    try {
        const hashedPassword = await cryptPassword(user.password);
        const tokenData = await generateToken();
        const encryptedToken=await encryptToken(tokenData.token);
        let userData; // Define userData outside the promise scope
        await new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO users (name, email, password, gender, token, expires_at,picture_id,bio) VALUES (?, ?, ?, ?, ?, ?,?,?)',
                [user.name, user.email, hashedPassword, user.gender, encryptedToken, tokenData.expiresAt,'-1',user.bio],
                (err, result) => {
                    if (err) {
                        console.error('Error creating user: ', err);
                        reject(err);
                    } else {
                        userData = { 
                            id : result.insertId,
                            name: user.name,
                            email: user.email,
                            gender: user.gender,
                            token: tokenData.token
                        };
                        resolve(userData);
                    }
                }
            );
        });
        return userData; // userData is now accessible here

    } catch (error) {
        console.error('Error creating user: ', error);
        throw error; // It's a good practice to throw the error so it can be handled by the caller
    }
};


const logIn = (user) => {
 const selectQuery = `SELECT * FROM users WHERE email = ?`;
 return new Promise((resolve, reject) => {
  connection.query(selectQuery, [user.email], async (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      reject(err);
      return;
    }
    if (results.length) {
      const userFromDb = results[0];
      const isPasswordMatch = await comparePassword(user.password, userFromDb.password);
      if (isPasswordMatch) {
        try {
        const tokenData = await generateToken();
        const encryptedToken=await encryptToken(tokenData.token);
        const updateQuery = `UPDATE users SET token = ?, expires_at = ? WHERE email = ?`;
        connection.query(updateQuery,[encryptedToken, tokenData.expiresAt, user.email],
        (err, updateResult) => {
            if (err) {
              console.error('Error updating user token:', err);
              reject(err);
              return;
            }
            if (updateResult.affectedRows === 1) {
              // Token successfully updated
              resolve({...userFromDb, token: tokenData.token ,expires_at:tokenData.expiresAt});
            } else {
              // No rows affected by the update, handle this case
              console.error('Token update failed. No rows affected.');
              resolve(null);
            }
          });
        } catch (error) {
          console.error('Error generating token:', error);
          reject(error);
        }
      } else {
        // Passwords don't match
        resolve(null);
      }
    } else {
      // User not found
      resolve(null);
    }
  });
 });
};


const isTokenExpired = async (user) => {
  try {
    let user_id = parseInt(user.id);
    return await new Promise((resolve, reject) => {
      const selectQuery = 'SELECT id, token, expires_at FROM users WHERE id = ?';
      connection.query(selectQuery, [user_id], async (err, results) => {
        if (err) {
          console.error('Error retrieving user data:', err);
          reject(err);
          return;
        }
        if (results.length) {
          const userId =results[0].id;
          const storedToken = results[0].token;
          const expiresAt = results[0].expires_at;
          const decryptedToken = await decryptToken(storedToken);

          if (decryptedToken !== user.token) {
            console.log('Provided token does not match stored token.');
            resolve({ expired: false }); 
            return;
          }
          const currentTime = new Date();
          console.log('Decrypted Token:', decryptedToken);
          console.log('Expires At:', expiresAt);
          console.log('Current Time:', currentTime);
          const isExpired = currentTime <= new Date(expiresAt);
          resolve({ expired: isExpired, userId: isExpired ? null : userId });
        } else {
          console.log("User not found in the database, assuming the token is expired");
          resolve({ valid: false });
        }
      });
    });
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return { expired: true };
  }
};

const settings = async (user) => {
  try {
    const selectQuery = `SELECT * FROM users WHERE id = ?`;
    const results = await new Promise((resolve, reject) => {
      connection.query(selectQuery, [user.id], (err, results) => {
        if (err) {
          console.error('Error retrieving user:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (results.length) {
      const userFromDb = results[0];
      const isPasswordMatch = await comparePassword(user.password, userFromDb.password);

      if (isPasswordMatch) {
        const hashedPassword = await cryptPassword(user.newPassword);
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        const updateResults = await new Promise((resolve, reject) => {
          connection.query(updateQuery, [hashedPassword , user.id], (err, results) => {
            if (err) {
              console.error('Error updating password:', err);
              reject(err);
            } else {
              resolve(results.affectedRows > 0 ? { success: true } : null);
            }
          });
        });

        return updateResults;
      }
    }

    return null;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

const searchForAccounts = async (user) => {
  try {
    const selectQuery = `SELECT id, name, picture_id FROM users WHERE name = ?`;
    
    const userResults = await new Promise((resolve, reject) => {
      connection.query(selectQuery, [user.name], (err, results) => {
        if (err) {
          console.error('Error finding the account:', err);
          reject(err);
        } else {
          resolve(results.length > 0 ? results : null);
        }
      });
    });

    if (!userResults) {
      return { userResults: null };
    }

    const friendsQuery = `
      SELECT u1.id as user_id, u1.name as user_name, u2.id as friend_id, u2.name as friend_name, f.status 
      FROM friends f 
      JOIN users u1 ON u1.id = f.user_id 
      JOIN users u2 ON u2.id = f.friend_id 
      WHERE f.status = 't' AND (f.friend_id = ? OR f.user_id = ?) AND (f.friend_id = ? OR f.user_id = ?)
    `;
    const friendsValues = [userResults[0].id, userResults[0].id, user.id, user.id];

    const isFriends = await new Promise((resolve, reject) => {
      connection.query(friendsQuery, friendsValues, (error, results) => {
        if (error) {
          console.error('Error fetching friends list:', error);
          reject(error);
        } else {
          const friendList = results.map((row) => {
            const friendId = row.user_id == userResults[0].id ? row.friend_id : row.user_id;
            return { id: friendId };
          });

          resolve(friendList.length > 0);
        }
      });
    });

    // Adding isFriends to each user in userResults
    userResults.forEach(user => {
      user.isFriends = isFriends;
    });

    return  userResults ;
  } catch (error) {
    console.error('Error processing request:', error);
    throw error;
  }
};



const changingProfilePicture = async (user,picture_id) => {
  try {
        const updateQuery = 'UPDATE users SET picture_id = ? WHERE id = ?';
        const updateResults = await new Promise((resolve, reject) => {
          connection.query(updateQuery, [picture_id , user.id], (err, results) => {
            if (err) {
              console.error('Error updating picture_id:', err);
              reject(err);
            } else {
              resolve(results.affectedRows > 0 ? { success: true } : null);
            }
          });
        });
      return updateResults;
  } catch (error) {
    console.error('Error updating picture_id:', error);
    throw error;
  }
}

const updateProfile = async (id,picture_id) => {
  try {
        const updateQuery = 'UPDATE users SET picture_id = ? WHERE id = ?';
        const updateResults = await new Promise((resolve, reject) => {
          connection.query(updateQuery, [picture_id , id], (err, results) => {
            if (err) {
              console.error('Error updating picture_id:', err);
              reject(err);
            } else {
              resolve(results.affectedRows > 0 ? { success: true } : null);
            }
          });
        });
    const selectQuery = `SELECT id,name,email,gender,token,picture_id,bio FROM users WHERE id = ?`;
     return new Promise((resolve, reject) => {
  connection.query(selectQuery, [id], async (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      reject(err);
      return;
    }
    else{
      const userFromDb = results[0];
      resolve(userFromDb);
    }
      });
  }) }catch (error) {
    console.error('Error updating picture_id:', error);
    throw error;
  }
}


module.exports = {
  createUser, 
  logIn,
  isTokenExpired,
  settings,
  searchForAccounts,
  changingProfilePicture,
  updateProfile
};