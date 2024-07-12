const mysql = require('mysql2');
const connection = require('./database');

const pictureTable = `CREATE TABLE IF NOT EXISTS pictures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  picture_distention VARCHAR(250) NOT NULL
);`;

connection.query(pictureTable, (err) => {
  if (err) {
    console.error('Error creating pictures table:', err);
  } else {
    console.log('pictures table created successfully!');
  }
});



const insertPicture = async (id,pictureName) => {
        try{
          const Id=parseInt(id)
      const insertedPicture=  await new Promise((resolve, reject) => {
            connection.query(
                'INSERT INTO pictures (user_id, picture_distention) VALUES (?, ?)',
                [Id, pictureName],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting picture: ', err);
                        reject(err);
                    } else {
                        resolve(result.affectedRows > 0 ? result.insertId : null);
                    }
                }
            );
        });
       return insertedPicture;
      }
      catch (error) {
        console.error('Error creating user: ', error);
        throw error; 
    }
}

const checkPicture = async (pictureId) => {
  try {
    const sql = 'SELECT * FROM pictures WHERE id = ?';
    const [rows] = await connection.promise().query(sql, [pictureId]);
    if (rows.length > 0) {
      console.log('Picture details:', rows);
    } else {
      console.log('No picture found with id:', pictureId);
    }
  } catch (error) {
    console.error('Error checking picture:', error);
  }
};


const updatePicture = async (id, pictureName, pictureId) => {
  try {
    const Id = parseInt(id);
    const pictureID = parseInt(pictureId);
    if (Id == null || pictureName == null || pictureID == null) {
      console.error('Invalid input parameters:', { Id, pictureName, pictureID });
      return { success: false, message: 'Invalid input parameters' };
    }



    if (isNaN(Id) || isNaN(pictureID)) {
      console.error('Invalid ID or pictureID:', { Id, pictureID });
      return { success: false, message: 'Invalid ID or pictureID' };
    }
    const postUpdateResult = await new Promise((resolve, reject) => {
      connection.query( 'UPDATE pictures SET  picture_distention = ? WHERE id = ?',
      [pictureName, pictureID],
      (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        }
      );
    });
        const postSelectResult = await new Promise((resolve, reject) => {
      connection.query( 'SELECT id FROM pictures  WHERE id = ?',
      [ pictureID],
      (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results[0].id : null);
          }
        }
      );
    });
    return postSelectResult;
  } catch (error) {
    console.error('Error updating picture:', error);
    throw error;
  }
};





const updateProfilePicture = async (id,pictureId) => {
  try {
    const Id = parseInt(id);
    const pictureID = parseInt(pictureId);
    if (Id == null ||  pictureID == null) {
      console.error('Invalid input parameters:', { Id, pictureID });
      return { success: false, message: 'Invalid input parameters' };
    }

    if (isNaN(Id) || isNaN(pictureID)) {
      console.error('Invalid ID or pictureID:', { Id, pictureID });
      return { success: false, message: 'Invalid ID or pictureID' };
    }
    const postUpdateResult = await new Promise((resolve, reject) => {
      connection.query( 'UPDATE pictures SET  user_id = ? WHERE id = ?',
      [Id, pictureID],
      (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        }
      );
    });
        const postSelectResult = await new Promise((resolve, reject) => {
      connection.query( 'SELECT id FROM pictures  WHERE id = ?',
      [ pictureID],
      (err, results) => {
          if (err) {
            console.error('Error updating post:', err);
            reject(err);
          } else {
            resolve(results.length > 0 ? results[0].id : null);
          }
        }
      );
    });
    return postSelectResult;
  } catch (error) {
    console.error('Error updating picture:', error);
    throw error;
  }
};




const selectPicture = async (id) => {
  try {
    let pictureId = parseInt(id);
    const results = await new Promise((resolve, reject) => {
      const sql = 'SELECT picture_distention FROM pictures WHERE id = ?';
      connection.query(sql, [pictureId], (err, result) => {
        if (err) {
          console.error('Error selecting picture:', err);
          reject(err);
        } else {
          resolve(result.length > 0 ? result[0].picture_distention : null);
        }
      });
    });

    return results;
  } catch (error) {
    console.error('Error selecting picture:', error);
    throw error;
  }
};


const deletePicture = async (id) => {
  try {
    const userId = parseInt(id);
    let pictureDistention = null;
    // First, select the picture_distention
    const selectResult = await new Promise((resolve, reject) => {
      const selectSql = 'SELECT picture_distention FROM pictures WHERE id = ?';
      connection.query(selectSql, [userId], (err, result) => {
        if (err) {
          console.error('Error selecting picture:', err);
          reject(err);
        } else {
          resolve(result.length > 0 ? result[0].picture_distention : null);
        }
      });
    });

    // If picture_distention is found, delete the picture
    if (selectResult) {
      pictureDistention = selectResult;
      const deleteResult = await new Promise((resolve, reject) => {
        const deleteSql = 'DELETE FROM pictures WHERE id = ?';
        connection.query(deleteSql, [userId], (err, result) => {
          if (err) {
            console.error('Error deleting picture:', err);
            reject(err);
          } else {
            resolve(result.affectedRows > 0);
          }
        });
      });

      // If the delete operation was successful, return the picture_distention
      if (deleteResult) {
        return pictureDistention;
      }
    }

    return null; // Return null if no picture was found or delete was unsuccessful
  } catch (error) {
    console.error('Error in deletePicture function:', error);
    throw error;
  }
};


module.exports = {
    insertPicture,
    updatePicture,
    selectPicture,
    deletePicture,
    updateProfilePicture    
};