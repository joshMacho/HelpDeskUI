import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const assignDeviceAsync = createAsyncThunk(
  "assignDevive/assignDeviceAsync",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post("/assigndevice", values);
      if (response.data.success) return response.data;
      throw new Error(
        response?.data?.error || `Unable to assign device to user`
      );
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
  error: null,
};

const assignDevice = createSlice({
  name: "assignDevice",
  initialState,
  reducers: {
    setAssignedDevice: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignDeviceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignDeviceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const info = action.payload.data;
        const index = state.data.findIndex(
          (device) => device.device_id === info.device_id
        );
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...info,
          };
        }
      })
      .addCase(assignDeviceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { setAssignedDevice } = assignDevice.actions;
export default assignDevice.reducer;
