'use client'
import React, { useEffect } from 'react'
import Cookies from 'universal-cookie';

const data = "hi";
const msg = "This is a fucking test";




const page = () => {
    const cookies = new Cookies();
    useEffect(() => {
        const doMyAxiosCall = async () => {
            if(cookies.get('SSID') == null){
                cookies.set('SSID', Math.floor(Math.random()*10e15));
            }
             
        }
        
        // This will only be executed on the client
        doMyAxiosCall();
     }, [])
  return (
    <div>
        <div>
            Message: {msg}
        </div>
        <div>
            EncryptionKey: {}
        </div>
    </div>
  )
}

export default page
