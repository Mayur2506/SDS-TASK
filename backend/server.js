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

// const userSocketMap = {};
// function getAllConnectedClients(roomId) {
//     // Map
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//         (socketId) => {
//             return {
//                 socketId,
//                 username: userSocketMap[socketId],
//             };
//         }
//     );
// }

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });

const userSocketMap = {};
// var prevdata;
var prevdata;
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
    socket.on('join', (room,username) => {
      console.log('room', room)
      
      userSocketMap[socket.id] = username;
      socket.join(room)
      const clients = getAllConnectedClients(room);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId:socket.id,
            });
            io.to(socketId).emit('new-join-sync',prevdata);
        });
    });

//Here we listen on a new namespace called "incoming data"
    socket.on('data', (data) => {
        //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
        console.log("initial wala sync")
        console.log('data', data)
        prevdata=data;
        socket.in(data.room).emit('data', { data: data })
    });


    
    
  
    //A special namespace "disconnect" for when a client disconnects
    socket.on('disconnect', () => console.log('Client disconnected'));
})
  