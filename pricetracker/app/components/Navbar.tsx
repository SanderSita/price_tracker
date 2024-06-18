'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const { data: session } = useSession();
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if(session) {
            console.log(session.user)
        }
    })

    const goToPage = (showmob: boolean, href: string) => {
        setShowMobileDropdown(showmob);
        router.push(href);
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <div className="w-full h-16 text-xl px-3 sticky top-0 bg-[#040A0D] z-50">
                <div className="max-w-[1300px] mx-auto flex justify-between items-center h-full">
                <Link onClick={() => goToPage(false, '/')} href="/"><h1 className="hover:drop-shadow-text duration-100 cursor-pointer font-bold">PRICE TRACKER</h1></Link>
                <div className="absolute inset-x-0 top-16 lg:relative lg:px-0 lg:top-0 bg-[#0f638e] lg:border-none border-b border-gray-400 rounded-b-xl">
                    <ul className={`lg:flex flex-row gap-10 px-5 dropdown-list max-h-0 lg:max-h-none lg:bg-[#040A0D] ${showMobileDropdown ? ' max-h-64' : ''}`}>
                    <li className='invisible'>.</li>
                    {session == null ? (
                        <>
                            <Link onClick={() => goToPage(false, '/login')} href="/login">
                                <li className='hover:drop-shadow-text duration-100 p-2 cursor-pointer'>Login</li>
                            </Link>
                            
                            <Link onClick={() => goToPage(false, '/register')} href="/register">
                                <li className='hover:drop-shadow-text duration-100 p-2 cursor-pointer'>Sign Up</li>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link onClick={() => goToPage(false, '/dashboard/search-products')} href="/dashboard/search-products">
                                <li className='hover:drop-shadow-text duration-100 p-2 cursor-pointer'>Products</li>
                            </Link>
                            <Link onClick={() => goToPage(false, '/dashboard/search-products')} className='lg:hidden' href="/dashboard/search-products">
                                <li className='hover:drop-shadow-text duration-100 p-2 cursor-pointer ml-10'>- Search Products</li>
                            </Link>
                            <Link onClick={() => goToPage(false, '/dashboard/tracked-products')} className='lg:hidden' href="/dashboard/tracked-products">
                                <li className='hover:drop-shadow-text duration-100 p-2 cursor-pointer ml-10'>- Tracked Products</li>
                            </Link>
                            <Link onClick={() => goToPage(false, '/')} className='flex gap-2' href="/">
                                <i className="bi bi-person text-2xl my-auto"></i>
                                <li className='hover:drop-shadow-text duration-100 p-2'>{session.user?.email}</li>
                            </Link>
                            {/* <Link onClick={() => signOut()} href="/">
                                <li className='hover:drop-shadow-text duration-100 p-2 cursor-pointer'>Logout</li>
                            </Link> */}
                        </>
                    )}
                    
                    <li className='invisible'>.</li>
                    </ul>
                </div>
                <div className="p-3 my-auto lg:hidden cursor-pointer" onClick={() => setShowMobileDropdown(!showMobileDropdown)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:hidden scale-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </div>
                </div>
            </div>
        </>
    );
}