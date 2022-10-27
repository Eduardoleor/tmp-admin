import { ReactNode } from "react";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";

interface SnackState {
  open: boolean;
  message: string;
  onClose?: () => void;
}

const initialState: SnackState = {
  open: false,
  message: "",
};

const snackSlice = createSlice({
  name: "snack",
  initialState,
  reducers: {
    setSnack: (state, action: PayloadAction<SnackState>) =>
      (state = action.payload),
    removeSnack: () => initialState,
  },
});

export const { setSnack, removeSnack } = snackSlice.actions;
export const selectSnack = (state: RootState) => state.snack;

export default snackSlice.reducer;
