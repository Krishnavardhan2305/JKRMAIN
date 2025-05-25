import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  client: null, 
  isAuthenticated: false,
};

const ClientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setclient: (state, action) => {
      state.client = action.payload;
      state.isAuthenticated = true; 
    },
    logout: (state) => {
      state.client = null;
      state.isAuthenticated = false; 
    },
  },
});

export const { setclient, logout } = ClientSlice.actions;
export default ClientSlice.reducer;
