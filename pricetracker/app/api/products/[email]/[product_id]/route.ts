import { getProductWithPriceHistory } from "@/app/api/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { updateProductEmailFlags } from "@/app/api/lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const pathname = req.nextUrl.pathname;
        const segments = pathname.split('/');
        const product_id = parseInt(segments[segments.length - 1]);
        const email = segments[segments.length - 2];

        const result = await getProductWithPriceHistory(email, product_id);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const { email_increase, email_decrease, track_price } = await req.json();

        const pathname = req.nextUrl.pathname;
        const segments = pathname.split('/');
        const productId = parseInt(segments[segments.length - 1]);

        await updateProductEmailFlags(productId, email_increase, email_decrease, track_price);

        return NextResponse.json({ message: 'Product email flags updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}