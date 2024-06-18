"use client"
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

interface Product {
    id: number,
    url: string;
    name: string;
    priceString: string;
    imageUrl: string;
  }

export default function SearchProducts() {
    const [isLoading, setIsLoading] = useState(false);
    const [inputString, setInputString] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const { data: session } = useSession();
    const router = useRouter();
    
    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    })

    const ocrUrl = async (url: string) => {
        try {
            const res = await fetch(process.env.PRICETRACKER_API_URL + '/ocr?url=' + url);
            
            if (res.status === 403) {
                toast("Something went wrong, try another time");
                return null;
            }
    
            if (!res.ok) {
                throw new Error('Failed to fetch OCR data');
            }
    
            const data = await res.json();
    
            if (!data || Object.keys(data).length === 0) {
                toast("No OCR data available for the provided URL");
                return null;
            }
    
            return data; 
        } catch (error) {
            setIsLoading(false);
            setInputString('');
            return null;
        }
    }

    const isDuplicate = () => {
        const findProduct = products.find(product => product.url == inputString);
        if(findProduct != null) {
            toast("Already searched for that product!");
        }
        return findProduct != null;
    }

    const submit = async () => {
        if(inputString.trim() == '' || isLoading || isDuplicate()) return;

        if(isURL(inputString)) {
            setIsLoading(true);
            const product = await ocrUrl(inputString);

            if(product == null || product.priceString == null || product.priceString.trim() == '' || product.priceString.trim() == 'null') {
                // invalid page / didnt get price
                toast.error("error occured getting the product data, please try again!");
                setIsLoading(false);
                setInputString('');
                return;
            }

            setProducts(prev => [...prev, product]);
            setIsLoading(false);
            setInputString('');
        } else {
            toast("Please use a valid URL");
            return;
        }
    }

    return (
        <div className="text-white text-center">
            <ToastContainer />
            <h1 className="text-4xl py-5 font-bold">Search products</h1>

            <div className="p-10 lg:px-56 px-5">
                <div className="w-full relative text-xl h-14 flex justify-center items-center mb-8">
                    <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} placeholder="Product URL.." className="h-full px-5 rounded-full bg-white text-black w-full"/>
                    <div onClick={submit} className="absolute right-0 text-4xl w-20 h-14 text-black cursor-pointer bg-[#0daaf9] flex justify-center items-center rounded-r-full">
                        {!isLoading ? (
                            <i className="bi bi-search"></i>
                        ) : (
                            <>
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="w-full flex flex-row gap-2 flex-wrap">
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}

                    {isLoading ? (
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex flex-col gap-5 w-80 bg-[#0B1318] rounded-lg">
                                <div className="w-full bg-slate-700 h-72 rounded-lg"></div>
                                <div className="px-5 pb-5">
                                    <div className="w-full p-4 rounded-lg bg-slate-700"></div>
                                </div>
                            </div>
                        </div>
                    ) : (null)}
                </div>
            </div>
        </div>
    )
}

function isURL(str: string) {
    const urlRegex = /^(?:https?|ftp):\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(?:\/\S*)?$/;
    return urlRegex.test(str);
}
  
  

