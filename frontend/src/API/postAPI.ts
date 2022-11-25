import axios from "axios";
import { postEndPoint } from "./apiEndpoint";

export const getAllPost = (tokenConfig): Promise<any> => {
  return axios.get(postEndPoint, tokenConfig);
};
export const sendLikeOnPost = (tokenConfig, id, userId): Promise<any> => {
  return axios.post(
    postEndPoint + `/sendLike/${id}`,
    { userId: userId },
    tokenConfig
  );
};
export const disLikeOnPost = (tokenConfig, id, userId): Promise<any> => {
  return axios.post(
    postEndPoint + `/disLike/${id}`,
    { userId: userId },
    tokenConfig
  );
};
export const commentOnPost = (tokenConfig, id, Comment): Promise<any> => {
  return axios.post(
    postEndPoint + `/commentOnPost/${id}`,
    { Comment: Comment },
    tokenConfig
  );
};
export const deletePost = (tokenConfig, id): Promise<any> => {
  return axios.delete(postEndPoint + `/${id}`, tokenConfig);
};
export const createPost = (tokenConfig, formData): Promise<any> => {
  return axios.post(postEndPoint + `/`, formData, tokenConfig);
};
