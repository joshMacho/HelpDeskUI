import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const deleteMakeAsync = createAsyncThunk(
  "devicemake/deleteMakeAsync",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await api.delete("/deletemake", { data: { ids } });
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || "Error deleting make");
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response?.data?.error || error.message,
      });
    }
  }
);

export const updateMakeAsync = createAsyncThunk(
  "devicemake/updateMakeAsync",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/updatemake/${id}`, values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || "Error updating make");
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
  error: "",
};

const deviceMake = createSlice({
  name: "devicemake",
  initialState,
  reducers: {
    setMake: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteMakeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMakeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const ids = action.payload.successfull;

        state.data = state.data.filter((make) => !ids.includes(make.make_id));
      })
      .addCase(deleteMakeAsync.rejected, (state, action) => {
        state.loading = false;
        state.erorr = action.payload.error;
      })
      .addCase(updateMakeAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMakeAsync.fulfilled, (state, action) => {
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
      .addCase(updateMakeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { setMake } = deviceMake.actions;
export default deviceMake.reducer;
