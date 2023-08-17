'use client'
import React, { useEffect, useState } from 'react'
import Header from '../header'
import Cookies from 'universal-cookie'
const cookies = new Cookies();





const page = () => {
  const [data, setData] = useState([] as any[]);
  useEffect(() => {
    fetch('http://localhost:8081/users')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err))
  }, [])
  
  return (
    
    <>
    <Header/>
     
      <main className="block min-h-screen items-center justify-between">
        <div className='flex w-full fixed top-2/4 text-center justify-center'>
          
          <table className='justify-center'>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i)=>(
                <tr key={i}>
                  <td>{d.fname}</td>
                  <td>{d.lname}</td>
                  <td>{d.email}</td>
                  <td>{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </main>
    </>
  )
}

export default page
