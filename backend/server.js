const express = require('express')
var cors = require('cors')
const app = express()
var socket = require('socket.io');
app.use(cors())
app.use(express.json());
const jwt = require('jsonwebtoken');
const JWT_SECRET = "SDSTASK";

const port = 5000
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/SDS"
mongoose.connect(mongoURI, () => {
    console.log("DB Connected successfully")
})


app.use('/auth', require('./auth'))

var server=app.listen(port, () => {
    console.log(`Server Spinning on port:${port}`)
})

var io = socket(server); 
var prevdata;
const userSocketMap = {};
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}


io.on('connection', (socket) => {
    socket.on('join', ({ roomId, username,token }) => {
        jwt.verify(token,JWT_SECRET, function(err, decoded) {
            if(err){
                io.to(socket.id).emit('notauth');
            }
            else{
                userSocketMap[socket.id] = username;
                socket.join(roomId);
                const clients = getAllConnectedClients(roomId);
                clients.forEach(({ socketId }) => {
                    io.to(socketId).emit('joined', {
                        clients,
                        username,
                        prevdata,
                    });
                });
            }
        });   
    });
 
    socket.on('data', (data) => {
        prevdata=data;
        socket.to(data.room).emit('data', { data: data })
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
    
})