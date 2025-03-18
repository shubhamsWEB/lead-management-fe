import { NextRequest, NextResponse } from "next/server";
import { loginService } from "@/services/api/apiReq/services/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  try {
    const response = await loginService({ email, password });
    return NextResponse.json(response);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error, { status: 400 });
  }
}