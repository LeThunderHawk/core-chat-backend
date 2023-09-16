'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "cookies-next";
function Header(){
    const [clicked, setClicked] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false);
    function clicking(){
        setClicked(!clicked)
    }
    useEffect(() => {
        const cookie = getCookie("SSID");
        if(cookie != null){
            setLoggedIn(true)
        }
    }, [])

    const windowWidth = window.innerWidth;
    if(windowWidth > 768){
        return(
            <div className="w-full h-16 max-md:hidden bg-gray-500 flex flex-row items-center justify-start rounded-ee-full sticky top-0">
            <Link href="./" className="m-12 hover:underline hover:cursor-pointer">Home</Link>
            {loggedIn ? <Link href="chat" className="m-12 hover:underline hover:cursor-pointer">Chat</Link> : <Link href="chat" className="m-12 hover:underline hover:cursor-pointer">Login</Link>}
            <Link href="userlist" className="m-12 hover:underline hover:cursor-pointer">Go to Member List!</Link>
            
            
            
    
        </div>)
    }else return(
   <><div className={`md:hidden fixed h-full bg-slate-600 w-[230px] opacity-80 text-2xl z-10 translate-x-[250px] duration-500 ${clicked === false? 'right-0' : 'right-[250px]'}`}>
        <div className="flex flex-col p-2 space-y-3">
            <div className="pt-2 pb-2 underline opacity-50">CoreChat</div>
        <Link href="./">Home</Link>
        {loggedIn ? <Link href="chat">Chat</Link> : <Link href="chat">Login</Link>}
        {loggedIn ? <Link href="profile">Profile</Link> : ""}
        </div>
    </div>

    <div className="md:hidden bg-slate-600 flex h-0 w-12 sticky top-3 left-full text-center z-50 mr-3">
        <button onClick={clicking}><FontAwesomeIcon icon={clicked ? faXmark : faBars} className='w-8 h-4 pl-2 pt-1'/></button>

    </div></>
    

    )
    

    
  }
  export default Header
