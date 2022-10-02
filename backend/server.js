// const ACTIONS =require('../src/Components/Actions')
const express = require('express')
var cors = require('cors')
const app = express()
var socket = require('socket.io');
app.use(cors())
app.use(express.json());

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
    // Map
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
    // console.log('New client connected')
    socket.on('join', ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        // io.to(socket.id).emit('sync', {
        //     prevdata
        // });
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                prevdata,
            });
        });
    });
 
    socket.on('data', (data) => {
        prevdata=data;
        console.log('data', data)
        socket.to(data.room).emit('data', { data: data })
    })
    // socket.on('sync', ({ socketId, code,roomId }) => {
        
    //     const data = { room: roomId, data: code }
    //     console.log("sync",data);
    //     io.to(socketId).emit('data',data);
    // });
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