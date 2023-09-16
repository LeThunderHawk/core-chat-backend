import { NextRequest, NextResponse } from 'next/server.js';
import mysql from 'mysql2/promise.js';
import dbconfig from '../db'

const orderByDate = (results) => {
  for(let i = 0; i<results.length; i++){
      const time_sent = new Date(results[i].time_sent)
      const date = new Intl.DateTimeFormat('en-US').format(time_sent);
      const time = new Intl.DateTimeFormat('en-US', {hour: 'numeric', minute: 'numeric', second:'numeric', hour12: false}).format(time_sent);
      results[i].date_sent = date; 
      results[i].time_sent = time;
  }
  var data = results,
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
  return result
}

export async function GET(req) {
  const myid = req.nextUrl.searchParams.get('myid');
  const personid = req.nextUrl.searchParams.get('personid');
  const limit = req.nextUrl.searchParams.get('limit') || "50";
  var data = []
  const dbconn = await mysql.createConnection(dbconfig);
  try{
    const query = 'SELECT seen,msg,time_sent,sent_from_id,sent_to_id,msg_id FROM `messages` WHERE (sent_from_id="'+myid+'" AND sent_to_id="'+personid+'") OR (sent_from_id="'+personid+'" AND sent_to_id="'+myid+'") ORDER BY time_sent DESC LIMIT '+limit;
    const seenquery = 'UPDATE messages SET seen=1 WHERE (sent_to_id="'+myid+'" AND sent_from_id="'+personid+'")'
    const del = 'DELETE FROM `notifications` WHERE to_id="'+myid+'" AND from_id="'+personid+'"';
    dbconn.execute(del)
    dbconn.execute(seenquery)
    const [res] = await dbconn.execute(query);
    data = orderByDate(res)
    dbconn.end();
  }catch(err){
    console.log(err)
  }
  return NextResponse.json([data][0])
}