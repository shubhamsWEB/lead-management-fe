import { NextRequest, NextResponse } from "next/server";
import { registerService } from "@/services/api/apiReq/services/auth";

export async function POST(request: NextRequest) {
  const data = await request.json();
  try {
    const response = await registerService(data);
    return NextResponse.json(response?.data);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error, { status: 500 });
  }
}