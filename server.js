const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { Socket } = require('dgram');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeaves,getRoomUsers} = require('./utils/users');

const app = express()
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName = 'System';
const appName = "Let's Chat";

//run when client connects
io.on('connection',socket => {
    // console.log('New ws connection....');

    socket.on('joinRoom',({username,room})=>{

        const user = userJoin(socket.id,username,room);

        socket.join(user.room); //socket functionality

        //welcome current user
        socket.emit('message',formatMessage(botName,`welcome to ${appName}`)) //emits the message to frontened js

        //broadcast when a user connects
        socket.broadcast
        .to(user.room)
        .emit(
            'message',
            formatMessage(botName,`${user.username} has joined the chat`)
            ); //broadcast to everybody except the user

        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });
    

    });

    
     //  io.emit() //this is for all the clients

     //listen for chatMessage
     socket.on('chatMessage', message => {
        console.log(message);
        //get current user 
        const user = getCurrentUser(socket.id);
        //now we will emit the message to everybody
        io
        .to(user.room)
        .emit('message',formatMessage(user.username,message));
     });
      
    //Runs when the user has disconnects
    socket.on('disconnect',() => {
        const user = userLeaves(socket.id);
        if(user){

        io
        .to(user.room)
        .emit('message',formatMessage(botName,`${user.username} has left the chat`)
        );

                //send users and room info
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        });
        }
        // console.log(user);
    });
});

// const PORT = 3000||process.env.PORT;

server.listen(process.env.PORT||3000,()=>console.log('Server running'));