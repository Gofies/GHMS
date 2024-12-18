import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
