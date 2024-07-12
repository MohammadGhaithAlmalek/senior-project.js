const mysql = require('mysql2');
const connection = require('./database');

const ChatsTable =`CREATE TABLE IF NOT EXISTS Chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
);`
;

const MessagesTable = `CREATE TABLE IF NOT EXISTS Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT,
    user_id INT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES Chats(chat_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`
;

connection.query(ChatsTable, (err) => {
  if (err) {
    console.error('Error creating ChatsTable:', err);
  } else {
    console.log('ChatsTable created successfully!');
  }
});

connection.query(MessagesTable, (err) => {
  if (err) {
    console.error('Error MessagesTable table:', err);
  } else {
    console.log('MessagesTable created successfully!');
  }
});