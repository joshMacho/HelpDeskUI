import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const addUserAsync = createAsyncThunk(
  "users/addUserAsync",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post("/createuser", values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || `Error adding user(s)`);
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response?.data?.error || `Unable to contact server`,
      });
    }
  },
);

export const updateUserAsync = createAsyncThunk(
  "users/updateUserAsync",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/updateuser/${id}`, values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || `Error updating user`);
    } catch (error) {
      console.log(`Error from updateUserAsync `, error);
      return rejectWithValue({
        error: error.response.data?.error || `Unable to contact server`,
      });
    }
  },
);

export const deleteUserAsync = createAsyncThunk(
  "users/deleteUserAsync",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/deleteusers`, { data: { ids } });
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || `Unable to delete user(s)`);
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error:
          error.response?.data?.error ||
          `Error deleting users. Check connection / contact admin`,
      });
    }
  },
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const users = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload.data);
      })
      .addCase(addUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const info = action.payload.data;
        const index = state.data.findIndex(
          (user) => user.user_id === info.user_id,
        );
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...info,
          };
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const ids = action.payload.data;
        state.data = state.data.filter((users) => !ids.includes(users.user_id));
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { setUsers } = users.actions;
export default users.reducer;
