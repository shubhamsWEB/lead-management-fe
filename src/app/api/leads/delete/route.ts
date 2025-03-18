import { NextResponse } from "next/server";
import HandleRequest from "@/services/api/requestsHandler";
import { deleteLeadService } from "@/services/api/apiReq/services/leads";
import { cookies } from "next/headers";
const authenticationInfo = async (request: Request) => {
  const cookieStore = await cookies();
  const requestHeader = {
    Authorization: `Bearer ${cookieStore.get("token")?.value}`,
  };
  return {requestHeader}
};

export async function POST(request: Request) {
    const data = await request.json()
    console.log("🚀 ~ POST ~ data:", data);
    const headers =await authenticationInfo(request);
    HandleRequest.setHeader(headers?.requestHeader);
    try {
      const response = await deleteLeadService(data);
      console.log("🚀 ~ POST ~ response:", response);
      
      return NextResponse.json(response);
    } catch (error) {
      console.log("🚀 ~ POST ~ error:", error);
      return NextResponse.json(error , { status: 400 });
    }
}