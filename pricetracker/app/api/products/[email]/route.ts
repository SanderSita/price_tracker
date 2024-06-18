import { NextRequest, NextResponse } from "next/server";
import { getProductsWithLatestPrice } from "../../lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const pathname = req.nextUrl.pathname;
        const segments = pathname.split('/');
        const email = segments[segments.length - 1];

        const result = await getProductsWithLatestPrice(email);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}