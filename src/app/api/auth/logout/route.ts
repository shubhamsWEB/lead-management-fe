import { NextRequest, NextResponse } from "next/server";
import { logoutService } from "@/services/api/apiReq/services/auth";

export async function POST(request: NextRequest) {
  try {
    const response = await logoutService();
    return NextResponse.json(response);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(error, { status: 500 });
  }
}