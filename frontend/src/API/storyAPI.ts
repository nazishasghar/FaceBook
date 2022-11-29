import axios from "axios";
import { storyEndPoint } from "./apiEndpoint";

export const getAllStories = (tokenConfig): Promise<any> => {
  return axios.get(storyEndPoint + "/getAllStories", tokenConfig);
};
export const createStory = (tokenConfig, formData): Promise<any> => {
  return axios.post(storyEndPoint + "/createStory", formData, tokenConfig);
};
