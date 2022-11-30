import axios from "axios";
import { friendsEndPoint } from "./apiEndpoint";

export const getAllFriends = (tokenConfig:object, userId:string): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/getFriends",
    { userId: userId },
    tokenConfig
  );
};
export const getRequestDetail = (userId:string, tokenConfig:object): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/getAllRequest",
    { userId: userId },
    tokenConfig
  );
};
export const addFriend = (
  currentUserId:string,
  addedFriendId:string,
  tokenConfig:object
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/addFriend",
    { currentUserId, addedFriendId },
    tokenConfig
  );
};
export const rejectRequest = (
  removeRequestFromUserId:string,
  removeSentRequestFromUserId:string,
  tokenConfig:object
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/removeRequest",
    { removeRequestFromUserId, removeSentRequestFromUserId },
    tokenConfig
  );
};
export const sendRequest = (
  sendRequestToUserId:string,
  getRequestFromUserId:string,
  tokenConfig:object
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/sendRequest",
    { sendRequestToUserId, getRequestFromUserId },
    tokenConfig
  );
};
export const unfriendUser = (
  currentUserId:string,
  unfriendUserId:string,
  tokenConfig:object
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/unfriend",
    { currentUserId, unfriendUserId },
    tokenConfig
  );
};
