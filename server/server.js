const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const {checkWinner} = require("./gameEngine")
const {rooms,createRoom,joinRoom} = require("./roomManager")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let players = {}

io.on("connection", socket => {

console.log("Jugador conectado:", socket.id)

players[socket.id] = {
id: socket.id,
credits: 100
}

io.emit("players_update", players)
io.emit("rooms_update", rooms)

socket.on("create_room", bet => {

let room = createRoom(socket.id, bet)

socket.join(room.id)

io.emit("rooms_update", rooms)

})

socket.on("join_room", roomId => {

let room = joinRoom(roomId, socket.id)

socket.join(roomId)

io.to(roomId).emit("start_game", room)

})

socket.on("move", data => {

let room = rooms[data.room]

if(!room) return

room.board[data.index] = room.turn

let winner = checkWinner(room.board)

if(winner){

io.to(data.room).emit("winner", winner)

}else{

room.turn = room.turn === "X" ? "O" : "X"

}

io.to(data.room).emit("update_board", room)

})

socket.on("disconnect", () => {

delete players[socket.id]

io.emit("players_update", players)

})

})

server.listen(3000, () => {
console.log("Servidor corriendo en http://localhost:3000")
})