import { NextRequest, NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'

export async function GET(req) {
  const myid = req.nextUrl.searchParams.get('myid');
  const personid = req.nextUrl.searchParams.get('personid');
  var data = []
  const dbconn = await mysql.createConnection(dbconfig);
  try{
    const query = 'SELECT msg, sent_from_id, msg_id FROM `messages` WHERE (sent_from_id="'+myid+'" AND sent_to_id="'+personid+'") OR (sent_from_id="'+personid+'" AND sent_to_id="'+myid+'") ORDER BY time_sent DESC LIMIT 1';
    const [res] = await dbconn.execute(query);
    data = res
    dbconn.end();
  }catch(err){
    console.log(err)
  }
  return NextResponse.json(data)
}