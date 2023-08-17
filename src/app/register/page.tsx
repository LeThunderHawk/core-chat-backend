'use client'
import React, { useEffect, useState } from 'react';
import { setCookie, getCookie } from 'cookies-next'
import Link from 'next/link'
import Header from '../header';

const Register = () => {
    const [inputs, setInputs] = useState([] as any);
    const [data, setData] = useState([] as any[])
    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values: any) => ({...values, [name]: value}))
      }
    const logindetails = async () => {
        return fetch('http://localhost:8081/insert?fname='+inputs.fname+'&lname='+inputs.lname+'&password='+inputs.password+'&email='+inputs.email)
        .then(res => res.json())
        .then(dataJson => {return dataJson})
        .catch(err => console.log(err))
    }
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const login = await logindetails();
        setCookie("SSID", login[0].public_id, { maxAge: 60 * 60 * 24 });
        console.log(login)
        window.location.href = '/chat';
    }
    
    
    
  return (
    <>
    <Header/>
    <div className='flex justify-center '>
    <div className='bg-white max-w-[450px] w-full rounded-2xl shadow-md m-5 max-md:mt-24 md:mt-52'>
        <section className='px-[25px] py-[30px] text-slate-900'>
            <header className='font-semibold text-2xl border-b-2 pb-3'>PlayJolt Chat App Signup</header>
            <form className='my-5' onSubmit={handleSubmit} autoComplete='off'>
                <div className='text-red-800'></div>
                <div className='flex mb-2.5 flex-col relative'>
                    <label className='mb-2'>First Name</label>
                    <input className='outline-none h-10 w-full border-slate-500 border-[1px] p-5 rounded-md' type='text' name='fname' placeholder='Enter your First Name' required={true} onChange={handleChange} value={inputs.fname || ""}></input>
                </div>
                <div className='flex mb-2.5 flex-col relative'>
                    <label className='mb-2'>Last Name</label>
                    <input className='outline-none h-10 w-full border-slate-500 border-[1px] p-5 rounded-md' type='text' name='lname' placeholder='Enter your Last Name' required={true} onChange={handleChange} value={inputs.lname || ""}></input>
                </div>
                <div className='flex mb-2.5 flex-col relative'>
                    <label className='mb-2'>Email</label>
                    <input className='outline-none h-10 w-full border-slate-500 border-[1px] p-5 rounded-md' type='text' name='email' placeholder='Enter your Email' required={true} onChange={handleChange} value={inputs.email || ""}></input>
                </div>
                <div className='flex mb-2.5 flex-col relative'>
                    <label className='mb-2'>Password</label>
                    <input className='outline-none h-10 w-full border-slate-500 border-[1px] p-5 rounded-md' type='text' name='password' placeholder='Enter your password' required={true} onChange={handleChange} value={inputs.password || ""}></input>
                </div>
                <div className='flex mb-2.5 flex-col relative hover:cursor-text'>
                    <input className='h-12 border-none text-lg bg-slate-800 text-white rounded-lg hover:cursor-pointer' type='submit' name='submit' value={"Sign up"}></input>
                </div>
                <div className='text-center m-2.5 text-slate-800'>Already Signed up? <Link href="chat">Login now</Link></div>
            </form>
        </section>

    </div>
    </div>
  </>
  )
}

export default Register


