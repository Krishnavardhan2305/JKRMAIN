import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import ClientSlice from "./ClientSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // local storage for web

const persistConfig = {
  key: "jkr2",
  version: 1,
  storage,
  whitelist: ["auth","client"],  
};

const rootReducer = combineReducers({
  auth: authSlice, 
  client:ClientSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
