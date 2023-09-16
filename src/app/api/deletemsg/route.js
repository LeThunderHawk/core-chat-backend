import { NextRequest, NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'

export async function GET(req) {
  const msg_id = req.nextUrl.searchParams.get('msg_id')
  var data = []
  const dbconn = await mysql.createConnection(dbconfig);
  if(msg_id){
    try{
      const query = 'UPDATE `messages` SET `msg` = "⊘ Nachricht gelöscht" WHERE `messages`.`msg_id` = '+ msg_id;
      const values = []
      const [res] = await dbconn.execute(query, values)
      data = res;
      
  
    }catch(err){
      console.log(err)
    }
  }
  dbconn.end()
  
  return NextResponse.json([data][0])
}