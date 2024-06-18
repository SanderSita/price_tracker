"use client"
import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function SearchProducts() {
    const [products, setProducts] = useState([]);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        // get products from db from this user
        if (!session) {
            router.push('/');
        }

        async function fetchData() {
            try {
                const res = await fetch(process.env.NEXT_API_URL + '/api/products/' + session?.user!.email);
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await res.json();
                console.log("PRODUCTS: ", data)
                setProducts(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [router, session]);

    return (
        <div className="text-white text-center w-full px-5">
            <h1 className="text-4xl py-5 font-bold pb-10">Tracked products</h1>

            <div className="w-full flex flex-row gap-2 flex-wrap justify-center">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
                {products.length == 0 ? (
                    <p>You have 0 tracked products. Search for new products in <Link className="underline text-blue-500" href={'/dashboard/search-products'}>search products</Link></p>
                ) : (null)}
            </div>
        </div>
    )
}
  
  

