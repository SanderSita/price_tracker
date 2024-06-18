import { addProduct, addPrice, findExistingProduct } from "../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    
    try {
        const { user_email, name, url, imageUrl, price } = await req.json();

        const existingProduct = await findExistingProduct(user_email, url);

        if (existingProduct) {
            return NextResponse.json({ error: 'Product already exists for this email and URL combination' }, { status: 400 });
        }
    
        // add the product
        const newProductId = await addProduct({
          user_email,
          name,
          url,
          image_url: imageUrl,
        }); 

        if(!newProductId){
          return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    
        await addPrice({
          product_id: newProductId,
          price: convertPriceStringToFloat(price),
          date: new Date(),
        });
    
        return NextResponse.json({ success: true, product_id: newProductId });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

function convertPriceStringToFloat(priceString: string) {
    // Remove currency symbols and any non-numeric characters
    const cleanedPriceString = priceString.replace(/[^\d,.]/g, '');

    // Replace comma with dot for decimal separator
    const normalizedPriceString = cleanedPriceString.replace(',', '.');

    // Parse the string as a float
    const price = parseFloat(normalizedPriceString);
    
    return price;
}

