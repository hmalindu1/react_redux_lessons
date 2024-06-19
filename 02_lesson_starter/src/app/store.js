import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "../feature/posts/postsSlice";
import usersSlice from "../feature/users/usersSlice";

export const store = configureStore({
  reducer: {
    posts: postsSlice,
    users: usersSlice,
  },
});
