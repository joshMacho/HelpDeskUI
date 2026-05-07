import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const addDeviceAsync = createAsyncThunk(
  "devices/addDeviceAsync",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post(`/addnewdevice`, values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || `Error adding device`);
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response?.data?.error || error.message,
      });
    }
  }
);

export const updateDeviceAsync = createAsyncThunk(
  "devices/updateDeviceAsync",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/updatedeviceinfo/${id}`, values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || `Error updating device`);
    } catch (error) {
      return rejectWithValue({
        error: error.response.data?.error || error.message,
      });
    }
  }
);

export const deleteDeviceAsync = createAsyncThunk(
  "devices/deleteDeviceAsync",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await api.delete("/deletedevice", { data: { ids } });
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || `Unable to delete device(s)`);
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response.data.error || error.message,
      });
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const devices = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addDeviceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addDeviceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload.data);
      })
      .addCase(addDeviceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateDeviceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDeviceAsync.fulfilled, (state, action) => {
        // do a lot
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
      .addCase(updateDeviceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteDeviceAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDeviceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const ids = action.payload.data;
        state.data = state.data.filter((item) => !ids.includes(item.device_id));
      })
      .addCase(deleteDeviceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { setDevices } = devices.actions;
export default devices.reducer;
