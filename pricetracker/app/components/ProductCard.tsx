'use client'

import Image from 'next/image';
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Product {
    id: number;
    url: string;
    name: string;
    priceString: string;
    imageUrl: string;
}

const ProductCard = ({ product }: { product: Product; }) => {
    const [loading, setLoading] = useState(false);
    const [tracked, setTracked] = useState(false);
    const [newProductId, setNewProductId] = useState(null);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    

    const trackProduct = async () => {
        if(!session || session == undefined || tracked == true) return;

        setLoading(true);
        // if user email doesnt exist, add user
        const userExists = await getUser(session.user!.email!)
        if(!userExists){
            console.log("add user")
        } else {
            console.log("user exists")
        }

        // add the product with the user email as FK
        // add a Price, with the product_id
        const requestBody = {
            user_email: session.user!.email,
            name: product.name,
            url: product.url,
            price: product.priceString,
            imageUrl: product.imageUrl,
        };

        const res = await fetch(process.env.NEXT_API_URL + '/api/products/', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if(res.status == 400) {
            toast.error("You already track this product!")
            setLoading(false);
            return
        }
        
        const productRes = await res.json();

        setTracked(true);
        setLoading(false);
        setNewProductId(productRes.product_id);
        console.log(productRes);
    }

    const goToDetails = () => {
        console.log("detials")
        router.push(`/dashboard/tracked-products/${product.id}`);
    }

    return (
        <div className="w-80 bg-[#0B1318] rounded-lg text-left">
            <Image width={500} height={500} src={product.imageUrl} alt={product.name} className="w-full rounded-lg max-h-72 object-cover" />
            
            <div className="p-5">
                <p className="text-xl min-h-14">{product.name} - <span className="text-[#0daaf9]">
                    {typeof(product.priceString) == 'number' ? parseFloat(product.priceString).toFixed(2) : product.priceString }</span>
                </p>
                {pathname.includes("tracked-products") ? (
                    <button onClick={goToDetails} className="p-3 bg-[#0daaf9] text-white mt-5 rounded-lg">Details</button>
                ) : (
                    <>
                        <button onClick={trackProduct} className={"p-3 bg-[#0daaf9] text-white mt-5 rounded-lg " + (tracked ? 'bg-green-500' : '')}>
                            {loading ? (
                                <>
                                <span className='flex gap-2'>
                                    Loading...
                                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                </span>
                                </>
                            ) : (
                                tracked ? (
                                    <>
                                        Product tracked <i className="bi bi-check2"></i>
                                    </>
                                ) : "Track product"
                            )}
                        </button>
                        {tracked && newProductId ? (
                            <Link href={'/dashboard/tracked-products/' + newProductId} className='text-right text-blue-500 ml-5 hover:underline cursor-pointer'>See details</Link>
                        ) : (null)}
                    </>
                )}
            </div>
        </div>
    )
}

async function getUser(email: string) {
    const res = await fetch(process.env.NEXT_API_URL + '/api/users/' + email);
    return res.json();
}

export default ProductCard;