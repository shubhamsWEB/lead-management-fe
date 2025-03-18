import { login, register } from "../configs/auth";
import RequestHandler from "../../requestsHandler";

const loginService = (params:any) =>
  new RequestHandler("apiServer", login(params))
    .call()
    .then((data: any) => ({ data: data }))  
    .catch((error: any) => {
      throw error;
    });

const registerService = (params:any) =>
  new RequestHandler("apiServer", register(params))
    .call()
    .then((data: any) => ({ data: data }))  
    .catch((error: any) => {
      throw error;
    });
export { loginService, registerService };
