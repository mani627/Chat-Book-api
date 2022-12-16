const express=require("express");
const app=express();
const http =require("http");
const {Server}=require("socket.io");
const cors= require("cors");

app.use(cors());

const server=http.createServer(app);

const port= process.env.PORT||8080;

const io= new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

 
// test for initial connect
io.on("connection",(socket)=>{
    console.log(socket.id)


   

    // send mssg
    socket.on("send",(data)=>{
        console.log("k",  data)
        socket.broadcast.to(data.room).emit("toall",data)

    })
    // typing
    socket.on("typing",(data)=>{
        console.log(data)
        socket.broadcast.to(data.room).emit("toall_typing",data)
    })

    // join group
    socket.on("join_group",(data)=>{
        // console.log(data)
       socket.join(data.room)
       
       socket.broadcast.to(data.room).emit("toall_join_noti",data)

        console.log("joined")
    })

   // click outside
   socket.on("cancel_typing",()=>{
   
    socket.broadcast.emit("toall_cancel_typing")
})

    socket.on("disconnect",(data)=>{
        console.log("user offline",data);
    })

// when user go back
     socket.on("leave",(data)=>{
        socket.broadcast.to(data.room).emit("toall_leave",data.user)
    })
  
})



app.get('/x', (req, res) => {
    res.send('Hello World!')
  })

server.listen(port,()=>{
    console.log("connected")
})