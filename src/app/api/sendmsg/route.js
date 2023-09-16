import { NextRequest, NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'



export async function GET(req) {
  const to = req.nextUrl.searchParams.get('to')
  const from = req.nextUrl.searchParams.get('from')
  const msg = req.nextUrl.searchParams.get('msg')

  const dbconn = await mysql.createConnection(dbconfig);
  try{
    const query = 'INSERT INTO `messages`(`msg`, `sent_from_id`, `sent_to_id` ) VALUES ("' + msg + '","' + from + '","' + to + '")';
    const notificationquery = 'INSERT INTO `notifications` (`from_id`, `to_id`) VALUES ("'+from+'", "'+to+'");';
    dbconn.execute(notificationquery)
    const values = []
    const [res] = await dbconn.execute(query, values)
    dbconn.end()

  }catch(err){
    console.log(err)
  }
  return NextResponse.json("sent")
}