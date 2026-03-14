const socket = io()

const playersDiv = document.getElementById("players")
const roomsDiv = document.getElementById("rooms")
const board = document.getElementById("board")

let currentRoom = null

socket.on("players_update", players => {

playersDiv.innerHTML = ""

Object.values(players).forEach(p => {

let div = document.createElement("div")

div.innerText = "Jugador " + p.id + " | Créditos: " + p.credits

playersDiv.appendChild(div)

})

})

socket.on("rooms_update", rooms => {

roomsDiv.innerHTML = ""

Object.values(rooms).forEach(room => {

let btn = document.createElement("button")

btn.innerText = "Unirse a sala | apuesta " + room.bet

btn.onclick = () => {

currentRoom = room.id
socket.emit("join_room", room.id)

}

roomsDiv.appendChild(btn)

})

})

document.getElementById("createRoom").onclick = () => {

let bet = document.getElementById("bet").value

socket.emit("create_room", bet)

}

socket.on("start_game", room => {

currentRoom = room.id

createBoard()

})

function createBoard(){

board.innerHTML = ""

for(let i=0;i<9;i++){

let cell = document.createElement("div")

cell.className = "cell"

cell.onclick = () => {

socket.emit("move",{room:currentRoom,index:i})

}

board.appendChild(cell)

}

}

socket.on("update_board", room => {

room.board.forEach((v,i)=>{

board.children[i].innerText = v

})

})

socket.on("winner", winner => {

alert("Ganador: " + winner)

})