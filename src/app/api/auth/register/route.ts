import { NextRequest, NextResponse } from "next/server";
import { registerService } from "@/services/api/apiReq/services/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const response = await registerService({ email, password });
  return NextResponse.json(response);
}