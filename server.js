require( 'dotenv' ).config()
const express = require( 'express' )
const path = require('path')
const app = express()
const port = process.env.SERVER_PORT || 3000
const request = require('request');
const urllib = require('urllib')

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

dict={}//teamToIDs
//this for generating dict{}/teamsToIDs with all teamsName:teamID based on teams.json
request('http://data.nba.net/10s/prod/v1/2018/teams.json', function(err, res, body){
        if (err) {
            throw err; 
        }
        const Allteams= JSON.parse(body).league.standard
       // console.log(Allteams)
        for (let i of Allteams){
            dict[i.nickname]=i.teamId
        }
    })

app.get('/teams/:teamName', function (req, response) {
    let teamName = req.params.teamName
    teamName= teamName.charAt(0).toUpperCase() + teamName.slice(1)
    const teamId = dict[teamName]
    request('http://data.nba.net/10s/prod/v1/2018/players.json', function(err, res, body){
        
        if (err) {
            throw err; 
        }
        const Allplayers = JSON.parse(body).league.standard
        const players= Allplayers.filter(p=> p.isActive==true && p.teamId===teamId).map(p=>{
            return new Player(p.firstName, p.lastName, p.jersey, p.pos, p.personId)
        })
        response.send(players)
    })
})

app.get('/playerStats/:player', function (req, response) {
    const PersonId = req.params.player
    let s = PersonId.split(/(?<=^\S+)\s/)
    urllib.request(`https://nba-players.herokuapp.com/players-stats/${s[1]}/${s[0]}`, function(err, res){
        if (err) {
            throw err; 
        }
        response.send(res)
    })   
})

class Player {
    constructor(firstName, lastName, jersey, pos, personId) {
        this.firstName = firstName
        this.lastName = lastName 
        this.jersey = jersey
        this.pos = pos
        this.personId = personId
    }
}


let socket = app.listen( port, () => console.log( `Running server on port ${ port }` ) )
                                    