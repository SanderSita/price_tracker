"use client";

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const validateFields = () => {
        // Regular expression to validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Check if email is valid
        if (!emailRegex.test(email)) {
          setError('Invalid email address');
          return false;
        }
    
        if (password.length < 5) {
          setError('Password must be at least 5 characters long');
          return false;
        }
    
        setError('');
        return true;
      };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(email.trim() == '' || password.trim() == '') return;

        if(!validateFields()) return;

        // save to db
        await saveUser({email, password})

        // handle auth
        const result = await signIn('credentials', {
            email,
            password,
            redirect: true,
            callbackUrl: '/dashboard/tracked-products'
        });
    }

    return (
        <div className="flex items-center justify-center">
            <div className='z-30 shadow-lg shadow-[#0daaf9] transform translate-y-44 rounded-xl bg-gradient-to-r from-[#8cc9e8] via-[#8cc9e8] to-[#0DAAF9] lg:w-1/3 w-4/5 mx-auto flex items-center p-1'>
                <form onSubmit={handleSubmit} className="w-full bg-[#040A0D] mx-auto text-center p-5 min-h-60 rounded-xl flex flex-col gap-3">
                    <i className="bi bi-person-circle text-6xl"></i>
                    <h1 className='lg:text-6xl text-4xl text-center font-semibold'>Sign Up</h1>
                    {error != '' ? (
                        <p className='text-red-500 py-2 text-center'>{error}</p>
                    ) : (null)}
                    <div className="relative flex items-center">  
                        <i style={{marginLeft: '5px'}} className="bi bi-envelope-fill text-xl absolute"></i>
                        <input className="w-full p-2 bg-transparent placeholder:gray-700 border-b indent-6 border-[#0daaf9] outline-none focus:border focus:rounded-xl" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div className="relative flex items-center">  
                        <i style={{marginLeft: '5px'}} className="bi bi-lock-fill text-xl absolute"></i>
                        <input className="w-full p-2 bg-transparent placeholder:gray-700 border-b indent-6 border-[#0daaf9] outline-none focus:border focus:rounded-xl" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>

                    <div className="flex justify-between text-slate-500">
                        <p>Already a Member? <Link href="/login" className="hover:underline cursor-pointer text-blue-500">Login</Link></p>
                        <p className="hover:underline cursor-pointer">Forgot password?</p>
                    </div>
                    
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8cc9e8] via-[#0DAAF9] to-[#0DAAF9] text-black font-bold cursor-pointer">
                        Create Account
                    </button>
                    <div style={{height: '1px'}} className='w-full bg-[#0daaf9]'></div>

                    {/* Google button */}
                    <a onClick={() => signIn('google')} className='py-4 px-6 bg-no-repeat border border-white rounded-xl cursor-pointer' style={{ backgroundImage: "url('/assets/svg/google-icon.svg')", backgroundSize: "auto 60%", backgroundPosition: "10px center" }}>
                        Log in with Google
                    </a>

                </form>
            </div>

            {/* SVG Background */}
            <div className="absolute bottom-0 left-0 w-full z-0">
                <Image className='hidden lg:block' src="/assets/svg/wave-haikei2.svg" alt="Wave Background" width={1920} height={500} />
                <Image className='block lg:hidden' src="/assets/svg/wave-haikei-mobile.svg" alt="Wave Background" width={1920} height={500} />
            </div>
        </div>
    );
}

async function saveUser(submitData: Object) {
    try{
        await fetch(process.env.NEXT_API_URL + '/api/users', {
            method: 'POST',
            body: JSON.stringify(submitData),
            headers: {
              'content-type': 'application/json'
            }
        })
    } catch(e) {
        console.log(e)
    }
}