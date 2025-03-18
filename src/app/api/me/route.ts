import { NextResponse } from "next/server";
import HandleRequest from "@/services/api/requestsHandler";
import { getMeService } from "@/services/api/apiReq/services/me";
import { cookies } from "next/headers";

const authenticationInfo = async (request: Request) => {
  const cookieStore = await cookies();
  const requestHeader = {
    Authorization: `Bearer ${cookieStore.get("token")?.value}`,
  };
  return {requestHeader}
};

export async function POST(request: Request) {
    const headers =await authenticationInfo(request);
    HandleRequest.setHeader(headers?.requestHeader);
    try {
      const response = await getMeService();
      
      return NextResponse.json(response?.data);
    } catch (error) {
      console.log("🚀 ~ POST ~ error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }
}
