let rooms = {}

function createRoom(player, bet){

let id = "room_" + Date.now()

rooms[id] = {

id: id,
players: [player],
bet: bet,
board: ["","","","","","","","",""],
turn: "X"

}

return rooms[id]

}

function joinRoom(roomId, player){

let room = rooms[roomId]

if(room && room.players.length < 2){

room.players.push(player)

}

return room

}

module.exports = {rooms, createRoom, joinRoom}