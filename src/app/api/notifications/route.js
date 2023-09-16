import { NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'



export async function GET(req) {
  const myid = req.nextUrl.searchParams.get('myid')
  var data = []
  const dbconn = await mysql.createConnection(dbconfig);
  try{
    const query = 'SELECT from_id,to_id FROM `notifications` WHERE to_id="'+myid+'"';
    // const del = 'DELETE FROM `notifications` WHERE to_id="'+myid+'"';
    // dbconn.execute(del)
    const [res] = await dbconn.execute(query)
    data = res
    dbconn.end()

  }catch(err){
    console.log(err)
  }
  return NextResponse.json(data)
}