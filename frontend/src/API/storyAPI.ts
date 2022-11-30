import axios from "axios";
import { storyEndPoint } from "./apiEndpoint";

export const getAllStories = (tokenConfig:object): Promise<any> => {
  return axios.get(storyEndPoint + "/getAllStories", tokenConfig);
};
export const createStory = (tokenConfig:object, formData:FormData): Promise<any> => {
  return axios.post(storyEndPoint + "/createStory", formData, tokenConfig);
};
