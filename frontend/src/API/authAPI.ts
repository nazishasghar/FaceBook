import axios from "axios";
import React from "react";
import { authEndPoint } from "./apiEndpoint";
const token = localStorage.getItem("token");
export const tokenConfig = {
  headers: {
    Authorization: "Bearer " + token,
  },
};
export const multimediaConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer " + token,
  },
};
export const logoutHandler = (userId: string): Promise<any> => {
  return axios.post(authEndPoint + "/logout", { userId }, tokenConfig);
};
export const createAccount = (formData, tokenConfig): Promise<any> => {
  return axios.post(authEndPoint + "/signup", formData, tokenConfig);
};
