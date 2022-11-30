import axios from "axios";
import { postEndPoint } from "./apiEndpoint";

export const getAllPost = (tokenConfig:object): Promise<any> => {
  return axios.get(postEndPoint, tokenConfig);
};
export const sendLikeOnPost = (tokenConfig:object, id:string, userId:string): Promise<any> => {
  return axios.post(
    postEndPoint + `/sendLike/${id}`,
    { userId: userId },
    tokenConfig
  );
};
export const disLikeOnPost = (tokenConfig:object, id:string, userId:string): Promise<any> => {
  return axios.post(
    postEndPoint + `/disLike/${id}`,
    { userId: userId },
    tokenConfig
  );
};
export const commentOnPost = (tokenConfig:object, id:string, Comment:object): Promise<any> => {
  return axios.post(
    postEndPoint + `/commentOnPost/${id}`,
    { Comment: Comment },
    tokenConfig
  );
};
export const deletePost = (tokenConfig:object, id:string): Promise<any> => {
  return axios.delete(postEndPoint + `/${id}`, tokenConfig);
};
export const createPost = (tokenConfig:object, formData:FormData): Promise<any> => {
  return axios.post(postEndPoint + `/`, formData, tokenConfig);
};
