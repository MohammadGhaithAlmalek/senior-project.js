const connection = require('../models/database');
const chatModel = require('../models/chat');

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.emit('connection', { message: 'Welcome to the chat!' });

        socket.on('createOrJoinRoom', ({ user_id, target_user_id }) => {
            console.log(`User ${user_id} is trying to create or join a room with ${target_user_id}`);
            connection.query(
                'SELECT chat_id FROM Chats WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)', 
                [user_id, target_user_id, target_user_id, user_id], 
                (err, results) => {
                    if (err) {
                        console.error('Error fetching chat: ' + err.message);
                        return;
                    }

                    let chat_id;
                    if (results.length > 0) {
                        chat_id = results[0].chat_id;
                        console.log(`Chat room ${chat_id} already exists for users ${user_id} and ${target_user_id}`);
                        
                        socket.join(chat_id);
                        console.log(`Socket joined existing chat room ${chat_id}`);
                        socket.emit('roomJoined', { chat_id });
                        io.to(chat_id).emit('message', { user_id, message: `User ${user_id} has joined the room.` });

                    } else {
                        connection.query(
                            'INSERT INTO Chats (user1_id, user2_id) VALUES (?, ?)', 
                            [user_id, target_user_id], 
                            (err, results) => {
                                if (err) {
                                    console.error('Error creating chat: ' + err.message);
                                    return;
                                }
                                chat_id = results.insertId;
                                console.log(`Created new chat room ${chat_id} for users ${user_id} and ${target_user_id}`);

                                socket.join(chat_id);
                                console.log(`Socket joined new chat room ${chat_id}`);
                                socket.emit('roomCreated', { chat_id });
                                io.to(chat_id).emit('message', { user_id, message: `User ${user_id} has joined the room.` });
                            }
                        );
                    }

                    connection.query('SELECT * FROM Messages WHERE chat_id = ?', [chat_id], (err, messages) => {
                        if (err) {
                            console.error('Error retrieving messages: ' + err.message);
                            return;
                        }

                        socket.emit('oldMessages', messages);
                    });
                }
            );
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });

        socket.on('chatMessages', (msg) => {
            const messageData = {
                user_id: msg.user_id,
                chat_id: msg.chat_id,
                message: msg.message
            };
            connection.query(
                'INSERT INTO Messages (chat_id, user_id, message) VALUES (?, ?, ?)', 
                [messageData.chat_id, messageData.user_id, messageData.message], 
                (err, results) => {
                    if (err) {
                        console.error('Error inserting message: ' + err.message);
                        return;
                    }
                    console.log(`Message inserted, ID: ${results.insertId}`);
                    console.log(`Broadcasting message to chat room ${messageData.chat_id}`);
                    
                    // Broadcast the message to the specific room
                    io.to(messageData.chat_id).emit('chatMessage', messageData);
                    console.log(`Message broadcasted to chat room ${messageData.chat_id}`);
                }
            );
        });
    });
};
