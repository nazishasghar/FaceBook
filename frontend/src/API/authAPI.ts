import axios from "axios";
import { authEndPoint } from "./apiEndpoint";
export const logoutHandler = (userId: string, tokenConfig:object): Promise<any> => {
  return axios.post(authEndPoint + "/logout", { userId }, tokenConfig);
};
export const createAccount = (formData:FormData, tokenConfig:object): Promise<any> => {
  return axios.post(authEndPoint + "/signup", formData, tokenConfig);
};
