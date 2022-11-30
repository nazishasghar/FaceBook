import axios from "axios";
import { messageEndPoint } from "./apiEndpoint";

export const getMessageForUser = (userId:string, tokenConfig:object): Promise<any> => {
  return axios.post(
    messageEndPoint + "/getMessagesForUser",
    { userId: userId },
    tokenConfig
  );
};
export const sendMessage = (
  SentBy:string,
  SentTo:string,
  Content:string,
  tokenConfig:object
): Promise<any> => {
  return axios.post(
    messageEndPoint + "/sendMessage",
    { SentBy, SentTo, Content },
    tokenConfig
  );
};
