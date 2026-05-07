import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

const initialState = {
  data: [],
  loading: false,
};

export const fetchProposalTypes = createAsyncThunk(
  "proposalTypes/fetchProposalTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/getproposaltypes`);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(
        response?.data?.error || `Unable to fetch proposal types`,
      );
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.error ||
          `Error fetching proposals. Check connection / contact admin`,
      );
    }
  },
);

const proposalTypes = createSlice({
  name: "proposalTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProposalTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProposalTypes.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchProposalTypes.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default proposalTypes.reducer;
