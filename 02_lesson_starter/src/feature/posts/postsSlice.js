import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const POSTS_URL = "http://localhost:3000/posts";

const initialState = {
  posts: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  if (response.status !== 200) {
    throw new Error("Failed to fetch posts");
  }
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      // Ensure userId is an integer
      initialPost.userId = parseInt(initialPost.userId, 10);
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const updateReaction = createAsyncThunk(
  "posts/updateReaction",
  async ({ postId, reaction }, { getState }) => {
    const post = getState().posts.posts.find((post) => post.id === postId);
    const updatedReactions = {
      ...post.reactions,
      [reaction]: post.reactions[reaction] + 1,
    };
    const response = await axios.put(
      `${POSTS_URL}/${postId}/reactions`,
      updatedReactions
    );
    return { postId, reactions: response.data };
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Add any fetched posts to the array
        state.posts = action.payload;
      })

      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addNewPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log(state.error);
      })

      .addCase(addNewPost.fulfilled, (state, action) => {
        // Ensure userId is correctly typed
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      })
      .addCase(updateReaction.fulfilled, (state, action) => {
        const { postId, reactions } = action.payload;
        const existingPost = state.posts.find((post) => post.id === postId);
        if (existingPost) {
          existingPost.reactions = reactions;
        }
      });
  },
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostStatus = (state) => state.posts.status;
export const getPostError = (state) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
