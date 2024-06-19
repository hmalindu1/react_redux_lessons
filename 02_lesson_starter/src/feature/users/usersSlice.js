import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const USER_URL = "http://localhost:3000/users";

export const fetchUsers = createAsyncThunk("posts/fetchUsers", async () => {
  const response = await axios.get(USER_URL);
  if (response.status !== 200) {
    throw new Error("Failed to fetch posts");
  }
  return response.data;
});


const initialState = [];

const usersSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;
