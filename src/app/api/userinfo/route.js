import { NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'



export async function GET(req) {
  const user_id = req.nextUrl.searchParams.get('user_id')
  var data = []
  const dbconn = await mysql.createConnection(dbconfig);
  try{
    const query = 'SELECT username, public_id, status FROM `users` WHERE public_id="'+ user_id + '"';
    const values = []
    const [res] = await dbconn.execute(query, values)
    data = res
    dbconn.end()

  }catch(err){
    console.log(err)
  }
  return NextResponse.json(data)
}