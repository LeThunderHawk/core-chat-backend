'use client'
import React, { useEffect, useRef, useState } from 'react'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faArrowRight, faChevronDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { CircularProgress } from '@nextui-org/progress'; 


const Chat = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message_send, setMessage_send] = useState(String);
  const [users, setUsers] = useState([] as any[]);
  const [messages, setMessages] = useState([] as any[]);
  const [userId, setUserId] = useState(String);
  const [username, setUsername] = useState([] as any);
  const [myuser, setMyuser] = useState({} as any);
  const [todo, setTodo] = useState([] as any)
  const [newMessageCounter, setNewMessageCounter] = useState({} as any)
  const controller = new AbortController();
  const signal = controller.signal;
  const apiRoute = "http://192.168.2.177:3000"
  var loadedMessageCount = 0;
  let enter = false;
useEffect(() => {
    const interval = setInterval(() => {
      fetch(apiRoute+'/api/notifications?myid=' + getCookie('SSID'))
      .then(res => res.json())
      .then(dataJson => setTodo(dataJson))
    }, 3000)
    // INSERT INTO `notifications` (`notif_id`, `from_id`, `to_id`, `optional_data`) VALUES (NULL, '56bdfdb7-a0c3-4fe1-8070-77db5073ca00', '0c1e7773-c688-40aa-bed6-2abd83b32c13', ''); 
    const users = fetch(apiRoute+'/api/users?myid=' + getCookie('SSID'))
    .then(res => res.json())
    .then(dataJson => { setUsers(dataJson); return dataJson})
    .catch(err => console.log(err))
    
    fetch(apiRoute+'/api/userinfo?user_id=' + getCookie('SSID'))
    .then(res=>res.json())
    .then(dataJson => { setMyuser(dataJson)})
    .catch(err => console.log(err))

    return () => {
      clearInterval(interval);
    }
  }, [])
useEffect(() => {
  handleTodo();
  }, [todo])

  const handleTodo = () => {
    const counts = {};
    for (const user of todo) {
      counts[user.from_id] = counts[user.from_id] ? counts[user.from_id] + 1 : 1;
      if(user.from_id == userId){
        const messages = fetchAllMessages(getCookie('SSID'), userId)
        window.localStorage.setItem(userId, JSON.stringify(messages))
      }else{
        getNewestMessage(getCookie('SSID'), user.from_id)
      }
    }
    setNewMessageCounter(counts)
  }
  const getNewestMessage = (SSID: any, userId: any) => {
    const data = fetch(apiRoute+'/api/newestmsg?myid='+SSID+'&personid='+userId)
    .then(res => res.json())
    .then(dataJson => {return dataJson})
    if(data[0]){
      if(data[0].sent_from_id == SSID){
        setNewestMessage("You: "+data[0].msg, userId);
      }else setNewestMessage(data[0].msg, userId);
    }
  }
  const deleteMessage = (e: any) => {
    // const msg_id = e.target.id;
    // console.log("deleted msg"+ msg_id)
    // fetch(apiRoute+'/deletemsg?msg_id=' + msg_id)
    // .then(() => {fetchmessages(getCookie('SSID'), userId)})
    // .catch(err => console.log(err))
    alert("Deleting is currently disabled...")
  }
  const fetchAllMessages = async (SSID:any, userId: any) => {
    await fetch(apiRoute+'/api/getmessages?myid=' + SSID + '&personid=' + userId)
    .then(res => res.json())
    .then(dataJson => { setMessages(dataJson);return(dataJson); })
    .catch(err => console.log(err))
  }
  const getSavedMessages = async (SSID: any, userId: any) => {
    const m = window.localStorage.getItem(userId);
    if(m != "{}" && m != "[]" && m && m !== null && m != "undefined"){console.log(m);setMessages(await JSON.parse(m)); }else fetchAllMessages(SSID, userId);
  }
  const fetchmessages = async (SSID: any, userId: any) => {
    fetch(apiRoute+'/api/userinfo?user_id='+userId)
    .then(res=> res.json())
    .then(dataJson => {setUsername(dataJson)})
    .catch(err => console.log(err))
    
    if(window.localStorage.getItem(userId)){
      getSavedMessages(SSID, userId)
    }else {
      const messages = await fetchAllMessages(SSID, userId)
      window.localStorage.setItem(userId, JSON.stringify(messages))
    }
    getNewestMessage(SSID, userId);
    setNewMessageCounter(prev => {delete prev[userId];return {...prev}})
  }
  const setNewestMessage = (newest: any, userId: any) => {
    users.forEach((user, index) => {
      if(user.public_id == userId){
        const newestmessage = (newest)
        var length = 7;
        var trimmedString = user.newestmsg.substring(0, length) + "...";
        console.log(trimmedString);
        if(userId == getCookie('SSID')){
          setUsers(prev => { prev[index].newestmsg = "You: "+trimmedString; return [...prev]});
        }else setUsers(prev => { prev[index].newestmsg = trimmedString; return [...prev]});
      }
    });
  }
  const sendMessage = (message: any, to: any) => {
    fetch(apiRoute+'/api/sendmsg?msg=' + message + '&from=' + getCookie('SSID') + '&to=' + to)
    .then(res => res.json)
    .then(dataJson => {return dataJson})
    .then(()=> {fetchAllMessages(getCookie('SSID'), to)})
    .catch(err => console.log(err))
    setNewestMessage("You: "+message, to);
  }
  const handleNewUser = async (e: any) => {
    e.preventDefault();
    
    if(textareaRef.current != null){
      textareaRef.current.focus();
    }
    const clickedId = e.target.id;
    setMessages(["Loading Chat..."]);
    setUserId(clickedId);
    fetchmessages(getCookie("SSID"), clickedId);
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
    if(message_send){
      sendMessage(message_send, userId);
    }
    fetchAllMessages(getCookie('SSID'), userId)
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
    deleteCookie('SSID');
    window.location.reload();
  }
  const groupmessages = (dataJson: any) => {
    if(typeof dataJson[0] == "string"){
      return dataJson;
    }
    var messages: any = [];
    for(const key in dataJson) {
      messages.push(dataJson[key][Object.keys(dataJson[key])[0]])
      messages.push(Object.keys(dataJson[key])[0])
    }
    return messages;
  }
  const windowWidth = window.innerWidth;
  if(windowWidth > 768){
    return (<main className="relative max-h-screen items-center justify-between mx-80 mt-4 flex-col">
    <div className='text-center w-full flex flex-row max-h-[1200px] h-screen'>
      <div className='w-3/12 overflow-y-auto overflow-x-hidden max-h-[1300px] scrollable mt-8 bg-gray-700 dark:bg-gray-800 rounded-l-xl '>
        <div className='h-20 border-b-[1px] border-b-gray-600 text-left p-3 flex justify-between w-full'>
          <img className="h-full rounded-full" src="diamond.png"/>
          <div className='p-4'>
          {myuser.length > 0 ? (myuser[0].username) : "Loading your user..."} 
          </div>
          <div className='hover:cursor-pointer hover:underline hover:text-red-600' onClick={Logout}>Logout</div>
        </div>
        <form>
          {users[0] ? 
          users.map((d: any, i: any) => {
            if(d.public_id != getCookie('SSID'))
            return  <button key={i} className='h-20 p-3 w-full text-left flex flex-row hover:cursor-pointer hover:bg-gray-600 z-10 border-t-[1px] border-slate-500' onClick={handleNewUser} id={d.public_id}>
                      <img src='diamond.png' className='h-full rounded-full' ></img> 
                      <div className='pl-4 pt-2 w-full' >{d.username} <div className='text-sm pl-1 text-gray-300'>{d.newestmsg}</div> </div>
                      {newMessageCounter[d.public_id] > 0 ? <div className='bg-slate-500 rounded-full inline h-6 text-center w-7 top-4 relative'>{newMessageCounter[d.public_id]}</div>: ""}
                    </button>
          })
          : <div className='text-center relative top-20 flex justify-center text-3xl'><CircularProgress isIndeterminate label='Loading Chats...'/></div>
          }
          
        </form>
      </div>
      <div className="w-9/12  max-h-[1200px] mt-8 mr-8 flex-col flex bg-gray-700 dark:bg-gray-800 rounded-r-xl">
        <div className='h-20'>
          <div className='text-left p-7'>{username[0] ? username[0].username : "Click on a User to Start a Chat"}</div>
        </div>

        <div className=' flex flex-col justify-start align-top max-h-full w-full scrollable h-[1260px] '>
          <div className='flex-col-reverse flex bg-slate-800 dark:bg-gray-900 justify-start h-full max-h-[1053px] mb-14 pb-2 rounded-md mr-3 overflow-y-auto scrollable '>
            {userId ? 
            ( messages.length > 0 ? 
              groupmessages(messages).map((data: any, key: any)=>(
            typeof data[0] !== "string" ? (
              data.map((msg: any, key:any) => (
                msg.sent_from_id == getCookie('SSID') ? 
              (
            <div key={key} className="flex text-left m-2 mr-16 flex-col [div&_p]:hover:visible">
              
              <div className='self-end bg-gray-700 rounded-md rounded-tr-none flex-row max-w-2xl '>
                <p className='relative self-start h-0 w-0 invisible right-5' id={msg.msg_id} ><FontAwesomeIcon icon={faTrashCan} className='relative hover:text-red-400' onClick={deleteMessage} id={msg.msg_id}/></p>
                
                <div className="w-0 h-0 border-l-[15px] border-l-gray-700 border-b-[10px] border-b-transparent float-right relative -right-[14px]"/>
                <div className='w-full p-3 self-start z-20'>{msg.msg} <div className='inline text-xs top-3 relative pl-3'>{msg.time_sent}{msg.seen == 1 ? <p className='inline h-2'><img className="h-6 inline" src="seen.svg"></img></p>: <p className='inline h-2'><img className="h-6 inline" src="unseen.svg"></img></p>}</div></div>
                <div className='w-0 h-0'></div>
              </div>
            </div>
              )
            : (
            <div key={key} className="flex text-left m-2 ml-16 flex-col [div&_p]:hover:visible">
              
              <div className='self-start bg-gray-800 rounded-md rounded-tl-none flex-row max-w-2xl '>
                <p className='relative self-end h-0 w-0 invisible '><FontAwesomeIcon icon={faChevronDown} className='relative hover:text-red-400' onClick={moreOptions}/></p>
                
                <div className="w-0 h-0 border-r-[15px] border-r-gray-800 border-b-[10px] border-b-transparent float-left relative -left-[14px]"/>
                <div className='w-full p-3 self-start z-20'>{msg.msg}<p className='inline text-xs top-2 relative pl-5'>{msg.time_sent}</p></div>
                
              </div>
            </div>
            )
             ))
            
          ) : <div key={key} className='bg-slate-500 bg-opacity-[0.2] w-auto self-center p-2 px-8 rounded-md mt-2 text-gray-500'>{data}</div>
          )) : <div className='bg-slate-500 bg-opacity-[0.2] w-auto self-center p-2 rounded-md mt-2 text-gray-500'>Send a Message to start this Chat</div>
          ) : <div className='bg-slate-500 bg-opacity-[0.2] w-auto self-center p-2 rounded-md mt-2 text-gray-500'>Click on a User to start a Chat</div>
          }
          {userId ? 
          <form className='flex left-36 w-full fixed bottom-16 text-center justify-center h-14' onSubmit={handleSubmit}>
            <div className='flex left-2 w-1/2 text-center justify-center pl-4'>
              <textarea onKeyDown={handleChange} onChange={onChange} ref={textareaRef} autoFocus name="text" maxLength={100} className='text-slate-50 left-4 md:w-full resize-none bg-slate-600 rounded-xl outline-none p-4 h-14 shadow-md shadow-slate-800' placeholder="Send a message" value={message_send || ""}/>
              <button value={message_send || ""} className="text-slate-50 h-10 relative -left-7 top-2 w-6"><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
            </div>
          </form>
          :
          <></>}
            
          </div>
        
      </div>
        
      </div>
    </div>
    
    
  </main>)
  }else {
    return(
      <main className='top-0 relative h-screen max-h-screen w-screen min-w-full'>
      {userId ? (
        <div>
          <div className='fixed top-0 bg-slate-600 w-full z-20 h-12 justify-center text-center pt-2.5'><div className='float-left ml-3 h-0' onClick={() => {setUserId("")}}><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon></div><div className=''>{username[0]? username[0].username : "Loading..."}</div></div>

          <div className=' flex flex-col justify-center align-top max-h-full w-full scrollable h-screen '>
            <div className='flex-col-reverse flex bg-slate-800 dark:bg-gray-900 justify-start h-full mb-4 rounded-md overflow-y-auto pb-14 pt-14 scrollable'>{( messages.length > 0 ? 
                groupmessages(messages).map((data: any, key: any)=>(
              typeof data[0] !== "string" ? (
                data.map((msg: any, key:any) => (
                  msg.sent_from_id == getCookie('SSID') ? 
                (
              <div key={key} className="flex text-left m-1 mr-5 ml-10 flex-col [div&_p]:hover:visible">
                
                <div className='self-end bg-gray-700 rounded-md rounded-tr-none flex-row max-w-2xl '>
                  <p className='relative self-start h-0 w-0 invisible right-5' id={msg.msg_id} ><FontAwesomeIcon icon={faTrashCan} className='relative hover:text-red-400' onClick={deleteMessage} id={msg.msg_id}/></p>
                  
                  <div className="w-0 h-0 border-l-[15px] border-l-gray-700 border-b-[10px] border-b-transparent float-right relative -right-[14px]"/>
                  <div className='w-full p-3 pt-3 self-start z-20 text-sm'>{msg.msg} <div className='inline text-[10px] top-2 relative pl-2'>{msg.time_sent}{msg.seen == 1 ? <p className='inline'><img className="h-5 inline" src="seen.svg"></img></p>: <p className='inline'><img className="h-5 inline" src="unseen.svg"></img></p>}</div></div>
                  
                </div>
              </div>
                )
              : (
              <div key={key} className="flex text-left m-1 ml-5 flex-col [div&_p]:hover:visible">
                
                <div className='self-start bg-gray-800 rounded-md rounded-tl-none flex-row max-w-2xl '>
                  <p className='relative self-end h-0 w-0 invisible '><FontAwesomeIcon icon={faChevronDown} className='relative hover:text-red-400' onClick={moreOptions}/></p>
                  
                  <div className="w-0 h-0 border-r-[15px] border-r-gray-800 border-b-[10px] border-b-transparent float-left relative -left-[14px]"/>
                  <div className='w-full p-3 self-start z-20 text-sm'>{msg.msg}<p className='inline text-[10px] top-2 relative pl-2'>{msg.time_sent}</p></div>
                  
                </div>
              </div>
              )
               ))
              
            ) : <div key={key} className='bg-slate-500 bg-opacity-[0.2] w-auto self-center p-2 px-8 mb-4 rounded-md mt-2 text-gray-500'>{data}</div>
            )) : <div className='bg-slate-500 bg-opacity-[0.2] w-auto self-center p-2 rounded-md mt-2 text-gray-500'>Send a Message to start this Chat</div>
            )}
            </div>
          </div>
        </div>)
      :
      <div className='h-full'>
        <div className='h-12 bg-slate-600 text-white justify-center pt-3 text-center'><div className='float-left ml-2 h-0' onClick={Logout}>Logout</div><div>{myuser[0]? myuser[0].username : "Loading your user..."}</div></div>
        <form className=''>
            {users[0] ? users.map((d: any, i: any) => {
              if(d.public_id != getCookie('SSID'))
              return  <div key={i} className='h-20 p-3 w-full text-left flex flex-row hover:cursor-pointer hover:bg-gray-600 bg-slate-800 z-10' onClick={handleNewUser} id={d.public_id}>
                        <img src='diamond.png' className='h-full rounded-full' id={d.public_id}></img> 
                        <div className='pl-4 pt-2 w-full' id={d.public_id}>{d.username}<div className='text-sm pl-1 text-gray-300' id={d.public_id}>{d.newestmsg}</div></div>
                        {newMessageCounter[d.public_id] > 0 ? <div className='bg-slate-500 rounded-full inline h-6 text-center w-7 top-4 relative'>{newMessageCounter[d.public_id]}</div>: ""}
                      </div>
            }): <div className='text-center relative top-20 flex justify-center text-3xl'><CircularProgress isIndeterminate label='Loading Chats...'/></div>}
      </form>
      </div>
      
      }
      {userId ? 
            <form className='flex w-screen fixed bottom-2 text-center justify-center h-14' onSubmit={handleSubmit}>
                <textarea onKeyDown={handleChange} onChange={onChange} ref={textareaRef} autoFocus name="text" maxLength={100} className='text-slate-50 w-screen resize-none bg-slate-600 rounded-xl outline-none p-4 h-14 shadow-md shadow-slate-800' placeholder="Send a message" value={message_send || ""}/>
                <button value={message_send || ""} className="text-slate-50 h-10 relative -left-7 top-2 w-6"><FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
            </form>
            :
            <></>}
    </main>
    )
  }
}

export default Chat
