'use client'
import React, { useEffect, useRef, useState } from 'react'
import { setCookie, getCookie } from 'cookies-next'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faArrowRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const sendMessage = (message: any, to: any) => {
  fetch('http://localhost:8081/sendmsg?msg=' + message + '&from=' + getCookie('SSID') + '&to=' + to)
  .then(res => res.json)
  .then(dataJson => {return dataJson})
  .catch(err => console.log(err))
}

const Chat = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message_send, setMessage_send] = useState(String);
  const [users, setUsers] = useState([] as any[]);
  const [messages, setMessages] = useState([] as any[]);
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState({} as any);
  const [myuser, setMyuser] = useState({} as any);
  let enter = false;
useEffect(() => {
    fetch('http://localhost:8081/users')
    .then(res => res.json())
    .then(dataJson => { setUsers(dataJson); return dataJson })
    .catch(err => console.log(err))

    fetch('http://localhost:8081/getuserinfo?user_id=' + getCookie('SSID'))
    .then(res=>res.json())
    .then(dataJson => {setMyuser(dataJson);})
    .catch(err => console.log(err))
  }, [])

  const deleteMessage = (e: any) => {
    const msg_id = e.target.id;
    fetch('http://localhost:8081/delete?msg_id=' + msg_id)
    .catch(err => console.log(err))
    fetchmessages(getCookie('SSID'), userId)
  }
  
  
  const fetchmessages = async (SSID: any, userId: any) => {
    fetch('http://localhost:8081/getuserinfo?user_id='+userId)
    .then(res=> res.json())
    .then(dataJson => setUsername(dataJson))
    .catch(err => console.log(err))

    fetch('http://localhost:8081/getmessages?myid=' + SSID + '&personid=' + userId)
    .then(res => res.json())
    .then(dataJson => { setMessages(dataJson); return(dataJson)})
    .catch(err => console.log(err))

    
  }
  
  const messagesoutput = (dataJson: any) => {
    for(const key in dataJson) {
      console.log(Object.keys(dataJson[key])[0])
      return(dataJson[key][Object.keys(dataJson[key])[0]]);
      
    }
  }
  const handleNewUser = async (e: any) => {
    e.preventDefault();
    if(textareaRef.current != null){
      textareaRef.current.focus();
    }
    const value = e.target.id;
    setUserId(value);
    const SSID = getCookie("SSID")
    await fetchmessages(SSID, value || null);
  }

  const handleChange = (e: any) => {
    const key = e.key;
    if(key == 'Enter'){
      enter = true;
      handleSubmit(e);
    }
    
  }
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if(enter = false){
      e.text.value = null;
      enter = true;
    }else e.value = null;
    
    if(textareaRef.current != null){
      textareaRef.current.focus();
    }
    sendMessage(message_send, userId);
    fetchmessages(getCookie('SSID'), userId)
    setMessage_send("");
  }
  const onChange = (e: any) => {
    const value = e.target.value;
    setMessage_send(value);
  }
  const moreOptions = (e: any) => {
    alert("not working yet sorry");
  }
  const Logout = () => {
    setCookie('SSID', null);
    window.location.reload();
  }
  
  
  return (
    <main className="relative max-h-screen items-center justify-between mx-80 mt-4 flex-col " >
      <div className='text-center w-full flex flex-row max-h-[1200px] h-screen'>
        <div className='w-3/12 overflow-y-auto overflow-x-hidden max-h-[1300px] scrollable mt-8 bg-gray-700 dark:bg-gray-800 rounded-l-xl '>
          <div className='h-20 border-b-[1px] border-b-gray-600 text-left p-3 flex justify-between w-full'>
            <img className="h-full rounded-full" src="diamond.png"/>
            <div className='p-4'>
            {myuser.length > 0 ? (myuser[0].fname +" "+ myuser[0].lname) : ""} 
            </div>
            <div className='hover:cursor-pointer hover:underline hover:text-red-600' onClick={Logout}>Logout</div>
          </div>
          <form>
            {users.map((d: any, i: any) => {
              if(d.public_id != getCookie('SSID'))
              return  <div key={i} className='h-20 p-3 w-full text-left flex flex-row hover:cursor-pointer hover:bg-gray-600 z-10' onClick={handleNewUser} id={d.public_id}>
                        <img src='diamond.png' className='h-full rounded-full' id={d.public_id}></img> <div className='pl-4 pt-2' id={d.public_id}>{d.fname} {d.lname} </div>
                      </div>
            })}
          </form>
          

        </div>
        <div className="w-9/12 overflow-y-auto max-h-[1300px] mt-8 mr-8 flex-col flex bg-gray-700 dark:bg-gray-800  rounded-r-xl">
          <div className='h-20'>
            <div className='text-left p-7'>{username.fname? username.fname : "Click on a User to Start the Chat"}</div>
          </div>

          <div className=' flex flex-col-reverse justify-start align-top max-h-full w-full scrollable h-[1260px]'>
            <div className='flex-col flex bg-slate-800 dark:bg-gray-900 justify-start h-full mb-14 rounded-md mr-3'>
            {/* {messages.length > 0 ? messagesoutput(messages).map() : "Sende eine Nachricht man"} */}
            {messages.length > 0 ? (messagesoutput(messages).map((d: any, i: any)=>(
              
              d.sent_from_id == getCookie('SSID') ? 
              <div key={i} className="flex text-left m-2 mr-16 flex-col [div&_p]:hover:visible">
                
                <div className='self-end bg-gray-700 rounded-md rounded-tr-none flex-row max-w-2xl '>
                  <p className='relative -left-2 self-start h-0 w-0 invisible '><FontAwesomeIcon icon={faChevronDown} className='-left-3 relative' onClick={deleteMessage} id={d.msg_id}/></p>
                  
                  <div className="w-0 h-0 border-l-[15px] border-l-gray-700 border-b-[10px] border-b-transparent float-right relative -right-[14px]"/>
                  <div className='w-full p-3 self-start z-20'>{d.msg} </div>
                  <div>{d.date_sent} {d.time_sent}</div>
                </div>
              </div>
              
              : 
              <div key={i} className="flex text-left m-2 ml-16 flex-col [div&_p]:hover:visible">
                
                <div className='self-start bg-gray-800 rounded-md rounded-tl-none flex-row max-w-2xl '>
                  <p className='relative -right-2 self-end h-0 w-0 invisible '><FontAwesomeIcon icon={faChevronDown} className='-left-2 relative' onClick={moreOptions}/></p>
                  
                  <div className="w-0 h-0 border-r-[15px] border-r-gray-800 border-b-[10px] border-b-transparent float-left relative -left-[14px]"/>
                  <div className='w-full p-3 self-start z-20'>{d.msg}</div>
                  
                </div>
              </div>
              
            ))) : <div className='bg-slate-500 bg-opacity-[0.2] w-auto self-center p-2 rounded-md mt-2 text-gray-500'>Send a Message to start this Chat</div>}
              <form className='flex left-32 w-full fixed bottom-20 text-center justify-center h-14' onSubmit={handleSubmit}>
              <div className='flex left-2 w-1/2 text-center justify-center pl-4'>
                <textarea onKeyDown={handleChange} onChange={onChange} ref={textareaRef} autoFocus name="text" className='text-slate-50 left-4 md:w-full resize-none bg-slate-600 rounded-xl outline-none p-4 h-14 shadow-md shadow-slate-800' placeholder="Send a message" value={message_send || ""}/>
                <button value={message_send || ""} className="text-slate-50 h-10 relative -left-7 top-2 w-6"><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
              </div>
            </form>
            </div>
          
        </div>
          
        </div>
      </div>
      
      
    </main>
  )
}

export default Chat
