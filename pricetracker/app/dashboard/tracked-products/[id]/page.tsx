"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Chart from '@/app/components/Chart';
import { toast, ToastContainer } from 'react-toastify';

interface Product {
    id: number;
    url: string;
    name: string;
    Price: [];
    priceString: string;
    imageUrl: string;
    email_decrease: boolean;
    email_increase: boolean;
    track_price: boolean;
}

export default function ProductPage({ params }: any) {
    const [product, setProduct] = useState<Product | null>(null);
    const [increase, setIncrease] = useState(false);
    const [decrease, setDecrease] = useState(false);
    const [trackprice, setTrackprice] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/');
            return;
        }
        
        async function getProduct() {
            const res = await fetch(process.env.NEXT_API_URL + '/api/products/' + session?.user?.email + '/' + params.id);
            const data = await res.json();
            setProduct(data);
            console.log(data)
            setIncrease(product?.email_increase!)
            setDecrease(product?.email_decrease!)
            setTrackprice(product?.track_price!)
        }

        if(params.id) getProduct();
         
    }, [params.id, product?.email_decrease, product?.email_increase, product?.track_price, router, session, session?.user?.email])

    const sendTestEmail = async () => {
        console.log("clicked")
        try {
            const email = session?.user?.email;
            if(email) {
                await fetch(process.env.PRICETRACKER_API_URL + '/email?email=' + email);
            }
            console.log("syccc")
            toast('email sent')
        } catch (error) {
            console.log(error)
            toast.error('Error sending email')
        }
    }

    const updateChecks = (pricechecked: boolean) => {
        setTrackprice(prev => !prev)
        if(!pricechecked) {
            setIncrease(false)
            setDecrease(false)
        }
    }

    const updateProductOptions = async (trackprice: boolean, dec: boolean, inc: boolean) => {
        await fetch(process.env.NEXT_API_URL + '/api/products/' + session?.user?.email + '/' + params.id, {
            method: "PUT",
            body: JSON.stringify({ 
                email_increase: inc, 
                email_decrease: dec ,
                track_price: trackprice
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const goBack = () => {
        router.push('/dashboard/tracked-products/');
    }

    return (
        <div className='mx-auto w-4/5 lg:w-1/2'>
            <ToastContainer />
            {product != null ? (
                <>
                    <h1 className='text-4xl py-5 font-bold pb-10 text-center'><i onClick={goBack} className="bi bi-arrow-left text-blue-500 cursor-pointer"></i> {product.name} <a href={product.url} target='_blank' className="bi bi-box-arrow-up-right text-blue-500 cursor-pointer"></a></h1>
                    <Chart priceData={product.Price} />

                    <h1 className='text-4xl font-bold py-10 text-center'>Options</h1>
                    <div className='p-5 bg-[#1F3038] rounded-xl mb-10'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex justify-between w-full'>
                                <p className='font-bold'>Track price</p>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" onChange={(e) => {updateChecks(e.target.checked); updateProductOptions(e.target.checked, !e.target.checked ? false : decrease, !e.target.checked ? false : increase)}} checked={trackprice} />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className='w-full h-[1px] py-1 border-b border-[#132229]'></div>
                            <h2 className='text-center'>Email Notifications</h2>

                            <div className='flex justify-between w-full'>
                                <p className='font-bold'>Notify on price decrease</p>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" onChange={(e) => {setDecrease(prev => !prev); updateProductOptions(trackprice, e.target.checked, increase)}} checked={decrease} />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    
                                </label>
                            </div>

                            <div className='flex justify-between w-full'>
                                <p className='font-bold'>Notify on price increase</p>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer" onChange={(e) => {setIncrease(prev => !prev); updateProductOptions(trackprice, decrease, e.target.checked)}} checked={increase} />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    
                                </label>
                            </div>
                            <p className='text-gray-400'><span className='text-red-500'>Notice: </span>emails could end up in your <span className='underline'>spam folder</span>. To send a test email 
                                <span onClick={sendTestEmail} className='text-blue-500 underline cursor-pointer'> click here</span>
                            </p>
                            
                        </div>
                    </div>
                </>
            ) : (null)}
        </div>
    )
}