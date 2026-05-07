import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  search: "",
  info: {
    name: "",
  },
};

const trail = createSlice({
  name: "trial",
  initialState,
  reducers: {
    setTrail: (state, action) => {
      state.data = action.payload;
    },
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setTrail, setInfo, setSearch } = trail.actions;
export default trail.reducer;
