'use client'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../header'
import { getCookie } from "cookies-next";

import Login from './login'
import Chat from './chat'


const page = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const cookie = getCookie("SSID");
    if(cookie != null) setLoggedIn(true); 
  }, [])
  return (
    <>
    <div className='h-screen'>
    <Header/>
    {loggedIn ? <Chat/> : <Login/>}
    
    </div>
    
    </>
  )
}

export default page
