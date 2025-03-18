import { getMe } from "../configs/me";
import RequestHandler from "../../requestsHandler";

const getMeService = () =>
  new RequestHandler("apiServer", getMe())
    .call()
    .then((data: any) => ({ data: data }))  
    .catch((error: any) => {
      throw error;
    });

export { getMeService };
