'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faAngleDown} from '@fortawesome/free-solid-svg-icons'

import React from 'react'
import Link from 'next/link';
import Header from '../header';

const skool = () => {
  return (
    <>
    <Header/>
    <main className='flex flex-col bg-slate-300'>
      <div className=" h-16 flex self-center md:w-1/2 border-b-2 border-slate-400 drop-shadow-xl">
        <div className='w-1/2 flex max-md:px-[1px] max-md:w-full'>
            <img className="h-14 w-14 rounded-md m-1" src="diamond.png"/>

            <div className="text-slate-900 flex flex-col justify-center px-3 font-bold text-lg ">
              Hui Bui Asia Restaurant
              <span className='font-normal flex'>
                <FontAwesomeIcon icon={faLocationDot} className='w-4 pt-[4px]'/>
                <span className='px-2'>Hersbruck </span>
                <button onClick={dropdown} className='w-5 mt-[-25px] ml-64'><FontAwesomeIcon icon={faAngleDown} /></button>
              </span>
              
            </div>
            
        </div>
        
      </div>
      <Link href="./" className='max-md:w-full w-1/2 bg-white h-16 m-5 max-md:mt-3 max-md:m-0 self-center flex rounded-xl text-slate-800'>
        <img src="diamond.png" className='rounded-xl m-1'/>
        <div className='flex flex-col'>
          <div className='underline font-semibold'>Sushi</div>
          <div className=''>post lorem ipsum blah blah blah</div>
        </div>
        
          
      </Link>
    </main>
    </>
  )
}

export default skool

function dropdown(){
  alert("not enabled yet");
}