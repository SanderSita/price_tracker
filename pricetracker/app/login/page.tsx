"use client"

import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        if(email.trim() == '' || password.trim() == '') return;

        // handle auth
        e.preventDefault();
        const result = await signIn('credentials', {
            email,
            password,
            redirect: true,
            callbackUrl: '/dashboard/tracked-products'
        });
    }
    
    return (
        <div className="flex items-center justify-center h-screen">
            <div className='z-30 shadow-lg shadow-[#0daaf9] mb-10 rounded-xl bg-gradient-to-r from-[#8cc9e8] via-[#8cc9e8] to-[#0DAAF9] lg:w-1/3 w-4/5 mx-auto flex items-center p-1'>
                <form onSubmit={handleSubmit} className="w-full bg-[#040A0D] mx-auto text-center p-5 min-h-60 rounded-xl flex flex-col gap-3">
                    <i className="bi bi-person-circle text-6xl"></i>
                    <h1 className='lg:text-6xl text-4xl text-center font-semibold'>Login</h1>
                    <div className="relative flex items-center">  
                        <i className="bi bi-envelope-fill text-xl absolute"></i>
                        <input className="w-full p-2 bg-transparent placeholder:gray-700 border-b indent-5 border-[#0daaf9] outline-none" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div className="relative flex items-center">  
                        <i className="bi bi-lock-fill text-xl absolute"></i>
                        <input className="w-full p-2 bg-transparent placeholder:gray-700 border-b indent-5 border-[#0daaf9] outline-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>

                    <div className="flex justify-between text-slate-500">
                        <p>No account? <Link href="/register" className="hover:underline cursor-pointer text-blue-500">Sign Up</Link></p>
                        <p className="hover:underline cursor-pointer">Forgot password?</p>
                    </div>
                    
                    <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8cc9e8] via-[#0DAAF9] to-[#0DAAF9] text-black font-bold">
                        Login
                    </button>

                    {/* Google button */}
                    <a onClick={() => signIn('google')} className='py-4 px-6 cursor-pointer bg-no-repeat border border-white rounded-xl' style={{ backgroundImage: "url('/assets/svg/google-icon.svg')", backgroundSize: "auto 60%", backgroundPosition: "10px center" }}>
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