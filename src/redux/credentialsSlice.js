import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  userLoading: true,
};

const credentialsSlice = createSlice({
  name: "credentials",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action?.payload?.user;
      state.token = action?.payload?.token;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
  },
});

export const { setCredentials, setUserLoading } = credentialsSlice.actions;
export default credentialsSlice.reducer;
