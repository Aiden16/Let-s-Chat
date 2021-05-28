//frontened js
const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();

//get username and room from url using QS
const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room);

//join chat room
socket.emit('joinRoom',{username,room});

//get room and users
socket.on('roomUsers',({room,users})=>{

    outputRoomName(room);
    outputUsers(users);

});
//console log to the chrome
//message from server
socket.on ('message',message =>{
    console.log(message); //catches the message from server side
    outputMessage(message);

    //scroll down to the new message
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

//Message submit 
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //retrieving the texts entered by user
    const message = e.target.elements.msg.value;
    console.log(message);

    //Emit a message to the server
    socket.emit('chatMessage',message);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

//output message to dom
function outputMessage(message){
    const div = document.createElement('div'); //creates a div
    div.classList.add('message');
    div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div); //appending the div to
                                                               //the div that has a class of
                                                               //chat-message

}

//add room name to dom

function outputRoomName(room){

    roomName.innerText = room;

}


//add users to DOM
function outputUsers(users){
    userList.innerHTML = `
     ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}