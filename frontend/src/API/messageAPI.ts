import axios from "axios";
import { messageEndPoint } from "./apiEndpoint";

export const getMessageForUser = (userId, tokenConfig): Promise<any> => {
  return axios.post(
    messageEndPoint + "/getMessagesForUser",
    { userId: userId },
    tokenConfig
  );
};
export const sendMessage = (
  SentBy,
  SentTo,
  Content,
  tokenConfig
): Promise<any> => {
  return axios.post(
    messageEndPoint + "/sendMessage",
    { SentBy, SentTo, Content },
    tokenConfig
  );
};
