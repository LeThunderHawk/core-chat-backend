import { NextRequest, NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'
const dotenv = require('dotenv');

export async function GET(req) {
  const myid = req.nextUrl.searchParams.get('myid');
  const dbconn = await mysql.createConnection(dbconfig);
    const query = 'SELECT public_id,username FROM `users` WHERE NOT public_id="'+myid+'"';
    const values = []
    const [result] = await dbconn.execute(query, values)
    const data = result
    if(myid){
    for(const user of data){
      const newestmsg = await fetch('http://192.168.2.177:3000/api/newestmsg?myid='+ myid +'&personid=' + user['public_id'])
        .then(res => res.json())
        .then(dataJson => {return dataJson[0]})
      if(newestmsg){
        var maxlength = 45;
        if(newestmsg.sent_from_id == myid){
          if(newestmsg.msg.length > maxlength){
            var trimmedString = newestmsg.msg.substring(0, maxlength) + "...";
          }else var trimmedString = newestmsg.msg;
          user['newestmsg'] = "You: "+ trimmedString
        }else{
          if(newestmsg.msg.length > maxlength){
            var trimmedString = newestmsg.msg.substring(0, maxlength) + "...";
          }else var trimmedString = newestmsg.msg;

          user['newestmsg'] = trimmedString
        }

      }else user['newestmsg'] = "Klicke um einen Chat zu starten";
    }
  }
  dbconn.end()
  return NextResponse.json(result)
}