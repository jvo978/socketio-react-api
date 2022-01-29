const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')


app.use(cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://silly-shannon-eb7ccd.netlify.app",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    socket.on("join_room", ({ username, room }) => {
            socket.join(room)
            socket.to(room).emit("receive_message", {
                id: socket.id,
                room,
                message: username +  " has joined the chat"
            })
    })

    socket.on("send_message", (messageData) => {
        socket.to(messageData.room).emit("receive_message", messageData)
    })

    socket.on("leave_room", ({ username, room }) => {
        socket.leave(room)
        socket.to(room).emit("receive_message", {
            id: socket.id,
            room,
            message: username +  " has left the chat"
        })
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id)
    })
})

server.listen(process.env.PORT || 3001, () => {
    console.log('Server is running...')
})
