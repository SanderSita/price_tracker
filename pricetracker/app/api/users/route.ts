/**
 * Routing for Users table
 */

import { NextResponse, NextRequest } from "next/server";
import { createUser, getUser } from "../lib/prisma";
import { hashPassword } from "@/utils/passwordUtils";

// create users
export async function POST(req: Request, res: Response) {
    const data = await req.json()
    data.password = await hashPassword(data.password)
    const result = createUser(data)

    return NextResponse.json(data)
}