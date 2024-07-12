const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const socketIo = require('socket.io');
const userRouter = require('./routers/userRouter');
const postRouter = require('./routers/postRouter');
const sealingPostRouter = require('./routers/sealingPostRouter');
const friendRouter = require('./routers/friendRouter');
const commentRouter = require('./routers/commentRouter');
const likeRouter = require('./routers/likeRouter');
const mixPostsRouter = require('./routers/mixPostsRouter');
const chatController = require('./controllers/chatting');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
});

const app = express();


app.use(cors());
app.use(hpp());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(limiter); 
app.use("/postPictures", express.static("./postPictures"));

// Routers
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', sealingPostRouter);
app.use('/api', friendRouter);
app.use('/api', commentRouter);
app.use('/api', likeRouter);
app.use('/api', mixPostsRouter);


const server = require('http').createServer(app);
const io = socketIo(server);
chatController(io);

const PORT = 443; 

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
