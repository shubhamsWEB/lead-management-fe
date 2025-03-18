import { NextResponse } from "next/server";
import HandleRequest from "@/services/api/requestsHandler";
import { exportLeadsService } from "@/services/api/apiReq/services/leads";
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
    const headers = await authenticationInfo(request);
    HandleRequest.setHeader(headers?.requestHeader);
    try {
      const response = await exportLeadsService(data);
      
      // Return the CSV data with appropriate headers
      return new NextResponse(response, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } catch (error) {
      console.log("🚀 ~ POST ~ error:", error);
      return NextResponse.json(error, { status: 400 });
    }
}