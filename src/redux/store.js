import { configureStore } from "@reduxjs/toolkit";
import addDeviceReducer from "./AddDeviceSlice";
import credentialsReducer from "./credentialsSlice";
import typeReducer from "./addTypeSlice";
import makeReducer from "./deviceMakeSlice";
import deviceReducer from "./deviceSlice";
import userReducer from "./userSlice";
import accountReducer from "./accountSlice";
import assignReducer from "./assignDeviceSlice";
import trialReducer from "./trailSlice";
import licenseReducer from "./licenseSlice";
import departmentReducer from "./departmentSlice";
import proposalReducer from "./proposalTypeSlice";

export const store = configureStore({
  reducer: {
    addDeviceReducer,
    credentials: credentialsReducer,
    deviceTypes: typeReducer,
    deviceMake: makeReducer,
    devices: deviceReducer,
    users: userReducer,
    accounts: accountReducer,
    assignDevice: assignReducer,
    trail: trialReducer,
    license: licenseReducer,
    departments: departmentReducer,
    proposalTypes: proposalReducer,
  },
});
