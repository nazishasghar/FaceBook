import { createSlice } from "@reduxjs/toolkit";

let token = localStorage.getItem("token");
let userData: any = localStorage.getItem("userData");
let userId = localStorage.getItem("userId");
let expirationTime = localStorage.getItem("expirationTime");
const authInitial = {
  token: token,
  userData: JSON.parse(userData),
  userId: userId,
  expirationTime: expirationTime,
};

console.log(userData);
export const AuthSlice = createSlice({
  name: "auth",
  initialState: authInitial,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
      state.userId = action.payload.userId;
      state.expirationTime = action.payload.expirationTime;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userData", JSON.stringify(action.payload.userData));
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("expirationTime", action.payload.expirationTime);
      localStorage.setItem("messages", JSON.stringify(action.payload.messages));
    },
    logout(state) {
      state.expirationTime = null;
      state.token = null;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("expirationTime");
    },
    getRequest(state, action) {
      state.userData.Requests = action.payload.requests;
    },
    removeSentRequest(state, action) {
      state.userData.RequestSentTo = state.userData.RequestSentTo.filter(
        (item) => item !== action.payload.id
      );
    },
    removeRequest(state, action) {
      state.userData.Requests = state.userData.Requests.filter(
        (item) => item !== action.payload.id
      );
    },
    sendRequest(state, action) {
      state.userData.RequestSentTo.unshift(action.payload.id);
      console.log(state.userData.RequestSentTo);
    },
    updateUser(state, action) {
      state.userData = action.payload.updatedUser;
    },
  },
});

const storyInitial = {
  stories: [],
};
export const StoriesSlice = createSlice({
  name: "stories",
  initialState: storyInitial,
  reducers: {
    getStories(state, action) {
      state.stories = action.payload.stories;
    },
    addStories(state, action) {
      state.stories.unshift(action.payload.createdStory);
    },
  },
});

const postInitial = {
  posts: [],
};
export const PostsSlice = createSlice({
  name: "posts",
  initialState: postInitial,
  reducers: {
    getPosts(state, action): any {
      state.posts = action.payload.posts;
      state.posts = state.posts.reverse()
    },
    commentOnPost(state, action): any {
      const post = state.posts.find((item) => item.id === action.payload.id);
      if (post) {
        post.Comments.push(action.payload.Comment);
      }
    },
    likeOnPost(state, action) {
      const post = state.posts.find((item) => item.id === action.payload.id);
      if (post) {
        post.Likes = post.Likes + 1;
      }
    },
    disLikeOnPost(state, action) {
      const post = state.posts.find((item) => item.id === action.payload.id);
      if (post) {
        post.Likes = post.Likes - 1;
      }
    },
    deletePost(state, action) {
      state.posts = state.posts.filter(
        (item) => item.id !== action.payload.id
      );
    },
    addPost(state, action) {
      state.posts.unshift(action.payload.createdPost);
    },
  },
});
const friendsState = {
  friends: [],
};
export const FriendsSlice = createSlice({
  name: "friends",
  initialState: friendsState,
  reducers: {
    getFriends(state, action) {
      state.friends = action.payload.friends;
    },
    addFriend(state, action) {
      state.friends.unshift(action.payload.addFriend);
    },
    removeFriend(state, action) {
      state.friends = state.friends.filter(
        (item) => item._id !== action.payload.id
      );
    },
  },
});
const messageInitial = {
  messages: [],
};
export const MessageSlice = createSlice({
  name: "messages",
  initialState: messageInitial,
  reducers: {
    getMessages(state, action) {
      state.messages = action.payload.messages;
    },
    sendMessage(state, action) {
      state.messages.push(action.payload.message);
    },
  },
});
export const MessageAction = MessageSlice.actions;
export const FriendsAction = FriendsSlice.actions;
export const PostAction = PostsSlice.actions;
export const StoryAction = StoriesSlice.actions;
export const AuthAction = AuthSlice.actions;
