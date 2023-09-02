const express = require('express')
const cors = require('cors')
const md5 = require('md5')


const app = express()
app.use(cors())
PORT = 4000

var pool = require('./utils/database.js');

app.get('/chats', function(req, res) {
    const sql = "SELECT * FROM `chats`"
    pool.getConnection(function(err, conn) {
        
        conn.query(sql, (err, data) => {
            if(err){
                conn.release();
            };
            conn.release();
            return res.json(data);
        });
        
    });
});

app.get('/info', (req, res) => {
    const envs = [
        {DBHOST: process.env.DBHOST},
        {DBUSER: process.env.DBUSER},
        {DBPASSWORD: process.env.DBPASSWORD},
        {DBNAME: process.env.DBNAME}
    ]
    return res.json('Sure I will leak all my data here...')
});

app.get('/', (req, res) => {
    return res.json('Backend');
    
})

app.listen(PORT, ()=>{
    console.log('listening on ' + PORT);
})
