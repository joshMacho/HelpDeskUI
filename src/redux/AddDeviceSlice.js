import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "",
  brand: "",
  model: "",
  serialNo: "",
};

const addDevice = createSlice({
  name: "addDevice",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setType } = addDevice.actions;
export default addDevice.reducer;
