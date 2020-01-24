const express=require("express")
const app=express()
const http=require("http")
const server=http.createServer(app)
const socketio=require("socket.io")
const io=socketio(server)
const PORT=process.env.PORT ||3000
const path=require("path")
const {getMessage}=require("../src/utils/getmessage")
const {addUsers,removeUser,getCurrentUser}=require("./utils/socket-users")
const Filter=require("bad-words")
app.use(express.static(path.join(__dirname,"../public")))

server.listen(PORT,()=>{

    console.log("Port is up and running")
})
// To connect to new user
io.on('connection', function (socket) {

socket.on("chatRoom",({username,room},callback)=>{
    const {error,user}=addUsers(socket.id,username,room)

    if(error){
        return callback(error)
    }

    socket.join(user.room)
    socket.broadcast.to(user.room).emit("message",getMessage(username,"New User Joined"))

    callback()

})

socket.on("sendMessage",(messageText,callback)=>{
    const getAUser=getCurrentUser(socket.id)
    const filter = new Filter(); 

    if(!filter.isProfane(messageText)){
        io.to(getAUser.room).emit("message",getMessage(getAUser.username,messageText))
        callback(undefined,"Message Delivered")
    }

    return callback("Bad words not allowed",undefined)

})

// Sending Location 
socket.on("sendLocation",({latitude,longitude})=>{
    const getAUser=getCurrentUser(socket.id)
    io.to(getAUser.room).emit("shareLocation",getMessage(getAUser.username,`https://www.google.com/maps?q=${latitude},${longitude}`))



})
// When user get disconnected

socket.on("disconnect",()=>{
    const removeThisUser=removeUser(socket.id)
    if(removeThisUser){
        io.to(removeThisUser.room).emit("message",getMessage(removeThisUser.username,"Left The Chat Room"))

    }


})

});

