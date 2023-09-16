
import { NextRequest, NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'
import md5 from 'md5'

export async function GET(req) {
  const username = req.nextUrl.searchParams.get('username')
  const password = req.nextUrl.searchParams.get('password')

  var data = []
  const dbconn = await mysql.createConnection(dbconfig);
  try{
    const checksql = 'SELECT username from `users` WHERE (username="'+username+'")';
    const randomUUID = crypto.randomUUID();
    const insertsql = 'INSERT INTO `users`(`username`, `password`, `public_id`) VALUES ("' + username + '","' + md5(password) + '","' + crypto.randomUUID() + '")';
    const loginsql = 'SELECT username, public_id from `users` WHERE (username="'+username+'" AND password="' + md5(password) + '")';
    const values = []
    const [check] = await dbconn.execute(checksql, values)
    if(check[0]){
        data = "err"
    }else{
        const insert = await dbconn.execute(insertsql)
        const [login] = await dbconn.execute(loginsql)
        data = login;
    }
    
    dbconn.end()

  }catch(err){
    console.log(err)
  }
  return NextResponse.json(data)
}