const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const md5 = require('md5')

const app = express()
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
);

const db = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.HOSTNAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.get('/', (req, res) => {
    return res.json('Backend API');
})

app.get('/createtable', (req, res) => {
    db.connect();
    return res.json('connected');
});
