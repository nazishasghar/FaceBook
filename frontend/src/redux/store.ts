import {
  configureStore,
  createSerializableStateInvariantMiddleware,
  isPlain,
} from "@reduxjs/toolkit";
import { serialize } from "v8";
import {
  AuthSlice,
  FriendsSlice,
  MessageSlice,
  PostsSlice,
  StoriesSlice,
} from "./reducer";

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    stories: StoriesSlice.reducer,
    posts: PostsSlice.reducer,
    friends: FriendsSlice.reducer,
    messages: MessageSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
