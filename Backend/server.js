const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const md5 = require('md5')

const app = express()
app.use(cors())
PORT = 4000


var pool = require('./utils/database.js');


app.get('/create', function(req, res) {

    pool.getConnection(function(err, connection) {
        const sql = "SELECT * FROM chats"
        pool.query(sql, (err, data) => {
            if(err) return res.json(err);
            if(data[0]) return res.json(data) 
            else return res.json("nothing")
        })

    });
});

app.get('/info', (req, res) => {
    return res.json(process.env.DBHOST)
});

app.get('/', (req, res) => {
    return res.json('From Backend Side');
    
})


app.listen(4000, ()=>{
    console.log('listening on ' + PORT);
})