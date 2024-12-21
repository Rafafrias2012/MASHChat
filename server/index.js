const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const config = require('./config.json');
const path = require('path');

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('login-attempt', (data) => {
        const { nickname, room } = data;
        
        // Basic validation
        if (nickname && room) {
            socket.emit('login-success', {
                nickname,
                room,
                timestamp: new Date().toISOString()
            });
        } else {
            socket.emit('login-error', 'Invalid nickname or room');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
http.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
