import axios from "axios";
import { friendsEndPoint } from "./apiEndpoint";

export const getAllFriends = (tokenConfig, userId): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/getFriends",
    { userId: userId },
    tokenConfig
  );
};
export const getRequestDetail = (userId, tokenConfig): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/getAllRequest",
    { userId: userId },
    tokenConfig
  );
};
export const addFriend = (
  currentUserId,
  addedFriendId,
  tokenConfig
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/addFriend",
    { currentUserId, addedFriendId },
    tokenConfig
  );
};
export const rejectRequest = (
  removeRequestFromUserId,
  removeSentRequestFromUserId,
  tokenConfig
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/removeRequest",
    { removeRequestFromUserId, removeSentRequestFromUserId },
    tokenConfig
  );
};
export const sendRequest = (
  sendRequestToUserId,
  getRequestFromUserId,
  tokenConfig
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/sendRequest",
    { sendRequestToUserId, getRequestFromUserId },
    tokenConfig
  );
};
export const unfriendUser = (
  currentUserId,
  unfriendUserId,
  tokenConfig
): Promise<any> => {
  return axios.post(
    friendsEndPoint + "/unfriend",
    { currentUserId, unfriendUserId },
    tokenConfig
  );
};
