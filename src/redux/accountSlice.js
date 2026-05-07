import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  error: null,
  loading: false,
  filterIndex: 2,
};

const accounts = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.data = action.payload;
    },
    setFilter: (state, action) => {
      state.filterIndex = action.payload;
    },
  },
});

export const { setAccounts, setFilter } = accounts.actions;
export default accounts.reducer;
