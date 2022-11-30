import axios from "axios";
import { userEndPoint } from "./apiEndpoint";

export const searchUser = (Name:string): Promise<any> => {
  return axios.get(userEndPoint + "/search/searchForUser", {
    params: {
      Name: Name,
    },
  });
};
export const getUserbyId = (userId:string, tokenConfig:object): Promise<any> => {
  return axios.get(userEndPoint + `/${userId}`, tokenConfig);
};
export const updateUser = (formData:FormData, tokenConfig:object): Promise<any> => {
  return axios.patch(userEndPoint + "/updateUser", formData, tokenConfig);
};
