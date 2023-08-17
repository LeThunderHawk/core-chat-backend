'use client'
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "cookies-next";


// cookies.set('SSID', 'number', { path: '/' });
// console.log(cookies.get('SSID'));

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
    return(
        <><div className="w-full h-16 max-md:hidden bg-gray-500 flex flex-row items-center justify-start rounded-ee-full sticky top-0">
        <Link href="./" className="m-12 hover:underline hover:cursor-pointer">Home</Link>
        {loggedIn ? <Link href="chat" className="m-12 hover:underline hover:cursor-pointer">Chat</Link> : <Link href="chat" className="m-12 hover:underline hover:cursor-pointer">Login</Link>}
        <Link href="games" className="m-12 hover:underline hover:cursor-pointer">Go to Member List!</Link>
        
        
        <Link href="store" className="m-12 hover:underline hover:cursor-pointer line-through text-red-700" >Store</Link>
        <Link href="about" className="m-12 hover:underline hover:cursor-pointer line-through text-red-700">About</Link>
        <Link href="profile" className="m-12 hover:underline hover:cursor-pointer line-through text-red-700">Profile</Link>
        

    </div>
    <div className={`md:hidden fixed h-full bg-teal-900 w-[230px] opacity-80 text-2xl z-10 translate-x-[250px] duration-500 ${clicked === false? 'right-0' : 'right-[250px]'}`}>
        <div className="flex flex-col p-2 space-y-3">
            <div className="pt-2 pb-2 underline">Menu</div>
        <Link href="./" className="hover:underline hover:cursor-pointer">Home</Link>
        <Link href="chat" className="hover:underline hover:cursor-pointer">Chat</Link>
        <Link href="skool" className="hover:underline hover:cursor-pointer">skool</Link>
        <Link href="games" className="hover:underline hover:cursor-pointer">Go to Member List! </Link>
        <Link href="store" className="hover:underline hover:cursor-pointer line-through text-red-700" >Store</Link>
        <Link href="about" className="hover:underline hover:cursor-pointer line-through text-red-700">About</Link>
        <Link href="profile" className="hover:underline hover:cursor-pointer line-through text-red-700">Profile</Link>
        </div>
    </div>

    <div className="md:hidden bg-teal-900 flex h-11 w-12 rounded-md sticky top-3 left-full text-center z-20 mr-3">
        <button onClick={clicking}><FontAwesomeIcon icon={clicked ? faXmark : faBars} className='w-8 h-4 pl-2 pt-1'/></button>

    </div>
    </>
    

    )
  }
  export default Header
