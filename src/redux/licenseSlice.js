import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";
import { I3DSquare } from "iconsax-reactjs";

export const addLicenseAsync = createAsyncThunk(
  "license/addLicenseAsync",
  async (values, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/addlicense", values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || "Error adding license");
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response?.data?.error || error.message,
      });
    }
  },
);

// update license
export const updateLicenseAsync = createAsyncThunk(
  "license/updateLicenseAsync",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/updateLicense/${id}`, values);
      if (response.data.success) return response.data;
      throw new Error(response.data?.error || "Error adding license");
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        error: error.response?.data?.error || error.message,
      });
    }
  },
);

// delete licenses
export const deleteLicenseAsync = createAsyncThunk(
  "license/deleteLicenseAsync",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/auth/deletelicense`, {
        data: { ids },
      });
      console.log(response.data);
      if (response.data.success) return response.data;
      throw new Error(response?.data?.error || `Unable to delete license(s)`);
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.error ||
          `Error deleteing license(s). Check connection / contact admin`,
      );
    }
  },
);

const initialState = {
  data: [],
  loading: false,
};

const license = createSlice({
  name: "license",
  initialState,
  reducers: {
    setLicense: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLicenseAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLicenseAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload.data);
      })
      .addCase(addLicenseAsync.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(updateLicenseAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLicenseAsync.fulfilled, (state, action) => {
        const info = action.payload.data;
        const index = state.data.findIndex(
          (license) => license.license_key === info.license_key,
        );
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            ...info,
          };
        }
      })
      .addCase(updateLicenseAsync.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteLicenseAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLicenseAsync.fulfilled, (state, action) => {
        state.loading = false;
        const ids = action.payload.data;
        state.data = state.data.filter(
          (licenses) => !ids.includes(licenses.license_key),
        );
      })
      .addCase(deleteLicenseAsync.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { setLicense } = license.actions;
export default license.reducer;
