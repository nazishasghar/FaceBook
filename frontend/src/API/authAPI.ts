import axios from "axios";
import { authEndPoint } from "./apiEndpoint";
export const logoutHandler = (userId: string, tokenConfig): Promise<any> => {
  return axios.post(authEndPoint + "/logout", { userId }, tokenConfig);
};
export const createAccount = (formData, tokenConfig): Promise<any> => {
  return axios.post(authEndPoint + "/signup", formData, tokenConfig);
};
