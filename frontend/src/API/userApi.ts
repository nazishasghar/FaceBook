import axios from "axios";
import { userEndPoint } from "./apiEndpoint";

export const searchUser = (Name): Promise<any> => {
  return axios.get(userEndPoint + "/search/searchForUser", {
    params: {
      Name: Name,
    },
  });
};
export const getUserbyId = (userId, tokenConfig): Promise<any> => {
  return axios.get(userEndPoint + `/${userId}`, tokenConfig);
};
export const updateUser = (formData, tokenConfig): Promise<any> => {
  return axios.patch(userEndPoint + "/updateUser", formData, tokenConfig);
};
