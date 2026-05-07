import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const addDepartmentAsync = createAsyncThunk(
  "departments/addDepartmentAsync",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post(`/addDepartment`, values);
      if (response?.data?.success) return response.data;
      throw new Error(response.data?.error || `Unable to add department`);
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error:
          error.response.data.error ||
          `Error adding department. Contact admin / check connection`,
      });
    }
  },
);

const initialState = {
  data: [],
  loading: false,
};

const departments = createSlice({
  name: "departments",
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDepartmentAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDepartmentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data.unshift(action.payload.data);
      })
      .addCase(addDepartmentAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setDepartments } = departments.actions;
export default departments.reducer;
