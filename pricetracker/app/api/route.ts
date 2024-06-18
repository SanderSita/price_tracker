import { NextResponse, NextRequest } from "next/server";

// test
export async function GET(request: Request) {
    const results = {
        message: "Hello World!"
    }

    return NextResponse.json(results);
}