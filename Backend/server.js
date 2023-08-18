const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const md5 = require('md5')
require('dotenv').config();

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: process.env.HOSTNAME,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

app.get('/', (req, res) => {
    return res.json('From Backend Side');
    
})

app.get('/login', (req, res) => {
    const sql = 'SELECT fname,lname,email,public_id from `users` WHERE (fname="' + req.query.fname + '" AND lname="' + req.query.lname + '" AND password="' + req.query.password + '")';
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        if(data[0]) return res.json(data) 
        else return res.json("nothing")
        
    })
})

app.get('/users', (req, res) =>{
    const sql = 'SELECT fname, lname, public_id, status FROM `users`';
    db.query(sql, (err, data)=>{
        if(err) return res.json(err);
        console.log(sql)
        return res.json(data);

    })
})
app.get('/delete', (req, res) =>{
    const changesql = 'UPDATE `messages` SET `msg` = "⊘ Nachricht gelöscht" WHERE `messages`.`msg_id` = ' + req.query.msg_id;
    const sql = 'DELETE FROM `messages` WHERE `msg_id` = ' + req.query.msg_id;
    db.query(changesql, (err, data)=>{
        if(err) return res.json(err);
        console.log(changesql)
        return res.json(data);
    })
})

app.get('/insert', (req, res) =>{
    const checksql = 'SELECT * from `users` WHERE (fname="' + req.query.fname + '" AND lname="' + req.query.lname + '")';
    const sql = 'INSERT INTO `users`(`fname`, `lname`, `password`, `email`, `public_id`) VALUES ("' + req.query.fname + '","' + req.query.lname + '","' + md5(req.query.password) + '","'+ req.query.email +'","'+ Math.floor(Math.random() *1000000000) +'")';
    const loginsql = 'SELECT fname,lname,email,public_id from `users` WHERE (fname="' + req.query.fname + '" AND lname="' + req.query.lname + '" AND password="' + md5(req.query.password) + '")';
    console.log(checksql)
    console.log(sql)
    db.query(checksql, (err, data)=>{
        if(err) return res.json(err);
        
        if(data[0]){
            console.log("Cancelled... user already exists");
        }else{
            db.query(sql, (err, data)=>{
                if(err) return res.json(err);
                db.query(loginsql, (err, data) => {
                    if(err) return res.json(err);
                    if(data[0]) return res.json(data) 
                    else return res.json("nothing")
                    
                })
            })
            console.log("new user created")
        };
    })
    
    
})
app.get('/getuserinfo', (req, res) => {
    if(req.query.user_id){
        const sql = 'SELECT fname, lname, public_id from `users` WHERE public_id=' + req.query.user_id;
        db.query(sql, (err, data) => {
            if(err) return res.json(err);
            return res.json(data);
        })
        }else return;
})
app.get('/sendmsg', (req, res) => {
    if(req.query.msg && req.query.from && req.query.to){
    const sql = 'INSERT INTO `messages`(`msg`, `sent_from_id`, `sent_to_id` ) VALUES ("' + req.query.msg + '","' + req.query.from + '","' + req.query.to + '")';
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        console.log(data)
        return res.json(data);
    })
    }else return;
})
app.get('/getmessages', (req, res) => {
    
    const sql = 'SELECT * FROM messages WHERE (sent_from_id='+req.query.myid+' AND sent_to_id='+req.query.personid+') OR (sent_from_id='+req.query.personid+' AND sent_to_id='+req.query.myid+') ORDER BY time_sent';
    console.log(sql)
    db.query(sql, (err, result)=>{
        if(err) return res.json(err);
        for(let i = 0; i<result.length; i++){
            const time_sent = new Date(result[i].time_sent)
            const date = new Intl.DateTimeFormat('en-US').format(time_sent);
            const time = new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric', second:'numeric', hour12: false}).format(time_sent);
            result[i].date_sent = date; 
            result[i].time_sent = time;
        }
        console.log(result)
        var data = result,
            groups = Object.create(null),
            result;

        data.forEach(function (a) {
            groups[a.date_sent] = groups[a.date_sent] || [];
            groups[a.date_sent].push(a);    
        });

        result = Object.keys(groups).map(function (k) {
            var temp = {};
            temp[k] = groups[k];
            return temp;
        });
        console.log("END ----------------------------------------->")
        // console.log(Object.keys(result[3])[0])
        // console.log(result[3][Object.keys(result[3])[0]])
        // Das sollte hinzugefügt werden:
        res.json(result)
                
    })
})

app.listen(8081, ()=>{
    console.log('listening');
})
