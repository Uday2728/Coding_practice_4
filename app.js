const express = require('express')
const path = require('path')
const dbPath = path.join(__dirname, 'cricketTeam.db')

const app = express()
app.use(express.json())

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null

const initiateDB = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })
}

initiateDB()
app.listen(3000)

//1st API- get array of all players

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
  SELECT *
  FROM 
  cricket_team
  ORDER BY
  player_id
  `
  response.send(await db.all(getPlayersQuery))
})

//2nd API- add player in the team

app.post('/players/', async (request, response) => {
  //length of the team
  const teamLengthQuery = `SELECT COUNT(player_id) AS length  FROM cricket_team;`
  let team = await db.get(teamLengthQuery)
  const {length} = team

  //adding player
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const postQuery = `
  INSERT INTO cricket_team (player_id, player_name, jersey_number, role)
VALUES (${length}, ${playerName}, ${jerseyNumber}, ${role});
`

  await db.run(postQuery)
  response.send(`Player Added to Team`)
})

// 3rd API- Returns a player based on a player ID

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  console.log(playerId)

  const getPlayerQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_id = ${playerId};`

  const dbResponse = await db.get(getPlayerQuery)
  response.send(dbResponse)
})

//4th API- updating existing values

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  console.log(playerName)

  const updatingQuery = `
  UPDATE cricket_team
  SET player_name = ${playerName}, jersey_number = ${jerseyNumber}, role = ${role}
  WHERE player_id = ${playerId};
  `

  await db.run(updatingQuery)
  response.send('Player Details Updated')
})

//5th API

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `
  DELETE from cricket_team
  WHERE player_id=${playerId}`

  await db.run(deleteQuery)

  response.send('Player Removed')
})

module.exports = app
