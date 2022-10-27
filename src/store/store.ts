import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import dialogSlice from "./dialogSlice";
import snackSlice from "./snackSlice";

export const store = configureStore({
  reducer: {
    dialog: dialogSlice,
    snack: snackSlice,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
