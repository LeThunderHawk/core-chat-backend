'use client'
import React, { useState } from 'react'
import Header from '../header'

const chatgpt = () => {
  const [message, setMessage] = useState(String);
  const handleChange = (event: any) => {
    const value = event.target.value;
    
    setMessage(value)
  }
  const handleSubmit = (event: any) => {
    event.preventDefault();
    event.target.text.value = "";
    console.log(message);
    setMessage("");
  }
  
  return (
    <>
    <Header/>
    <main className="relative overflow-y-hidden max-h-screen items-center justify-between mx-4 mt-4 flex-col" >
      <div className='text-center w-full flex flex-row max-h-[1200px] h-screen'>
        <div className=' w-3/12 overflow-y-auto overflow-x-hidden max-h-[1200px] scrollable pt-10'>

          <div className='bg-gray-800 h-16 p-2 w-full flex flex-row '>
            <div className='w-1/12 max-h-full ml-2'>
              <img src="diamond.png" className='w-full h-full rounded-full'></img>
            </div>
            <div className='justify-center h-full w-full flex flex-col overflow-hidden ml-4'>
              <div className='w-full justify-start flex'>Jonas</div>
              <div className='text-slate-400 justify-start flex text-sm ml-2'>hi</div>
            </div>
          </div>

        </div>
        <div className='w-9/12'>
        <div className="overflow-y-auto max-h-[1170px] scrollable mt-8 mr-8 flex-col-reverse flex">

          <div className="border-l-4 m-2 rounded-sm">
            <div className='w-1/2 bg-green-900 p-3'>Incoming</div>
            <span className="text-slate-400 text-xs bg-green-900 justify-end flex w-1/2 px-2 py-1">19.02.23 | 23:02</span>
          </div>

          <div className="flex content-center text-right border-r-4 m-2 rounded-sm flex-col">
            <div className='w-1/2 bg-green-950 p-3 self-end'>Outgoing</div>
            <span className="text-slate-400 text-xs bg-green-950 w-1/2 self-end text-left py-1 px-2">19.02.23 | 23:02</span>
          </div>

          </div>


          <form className='flex left-2 w-full fixed bottom-3 text-center justify-center' onSubmit={handleSubmit}>
          <textarea onChange={handleChange} name="text" className='text-slate-50 left-4 md:w-5/12 resize-none bg-slate-600 rounded-xl outline-none p-4 h-14' placeholder="Send a message "/>
          <button value={message || ""} className="text-slate-50 mx-3 px-20 border-2 disabled:bg-stone-500 enabled:bg-green-900 max-md:px-1 rounded-lg h-14">Submit</button>
          </form>
        </div>
      </div>
      
      
    </main>
    </>
  )
}

export default chatgpt
