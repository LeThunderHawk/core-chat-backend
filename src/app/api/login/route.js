import { NextRequest, NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'

export async function GET(req) {
  const username = req.nextUrl.searchParams.get('username')
  const password = req.nextUrl.searchParams.get('password')
  var data = []
  const dbconn = await mysql.createConnection(dbconfig);
  try{
    const query = 'SELECT public_id,username from users WHERE (username="'+username+'" AND password="'+password+ '")';
    const values = []
    const [res] = await dbconn.execute(query, values)
    if(res){
        data = res;
    }else data = "err"
    
    dbconn.end()
  }catch(err){
    console.log(err)
  }
  return NextResponse.json(data)
}