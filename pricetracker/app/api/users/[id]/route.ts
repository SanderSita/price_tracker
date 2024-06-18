import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const pathname = req.nextUrl.pathname;
    const segments = pathname.split('/');
    const email = segments[segments.length - 1];

    const result = await getUser(email);

    return NextResponse.json(result);
}