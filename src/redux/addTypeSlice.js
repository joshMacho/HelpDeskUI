import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const deleteTypeAsync = createAsyncThunk(
  "devicetype/deleteTypeAsync",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await api.delete("/deletetypes", { data: { ids } });
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || "Error deleting types");
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response?.data?.error || error.message,
      });
    }
  }
);

export const updateTypeAsync = createAsyncThunk(
  "devicetype/updateTypeAsync",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/updatetype/${id}`, values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || "Error deleting types");
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response?.data?.error || error.message,
      });
    }
  }
);

const initialState = {
  data: [],
  loading: false,
};

const addType = createSlice({
  name: "devicetype",
  initialState,
  reducers: {
    setTypes: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTypeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTypeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const ids = action.payload.successfull;

        state.data = state.data.filter((type) => !ids.includes(type.type_id));
      })
      .addCase(deleteTypeAsync.rejected, (state, action) => {
        state.loading = false;
        state.erorr = action.payload.error;
      })
      .addCase(updateTypeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTypeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const info = action.payload.data;
        const index = state.data.findIndex(
          (type) => type.type_id === info.type_id
        );
        // update at index
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...info,
          };
        }
      })
      .addCase(updateTypeAsync.rejected, (state, action) => {
        state.loading = false;
        state.erorr = action.payload.error;
      });
  },
});

export const { setTypes } = addType.actions;
export default addType.reducer;
