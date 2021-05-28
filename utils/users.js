const users = [];

//join user to the chat

function userJoin(id,username,room){
    const user = {id,username,room};
    //add the user to the users room
    users.push(user);
    return user;
}

//function to get the current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
};

//user leaves chat
function userLeaves(id){
    const index = users.findIndex(user => user.id === id);
    if(index!==-1){ //if index exist
        return users.splice(index,1)[0]; //return the removed item
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomUsers
};