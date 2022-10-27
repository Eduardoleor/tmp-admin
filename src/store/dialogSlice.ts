import { ReactNode } from "react";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "./store";

interface DialogState {
  open: boolean;
  title: string;
  subtitle?: string;
  body?: ReactNode;
  secondaryButtonAction?: () => void;
  secondaryButtonText?: string;
  primaryButtonAction?: () => void;
  primaryButtonText?: string;
  onClose?: () => void;
}

const initialState: DialogState = {
  open: false,
  title: "",
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDialog: (state, action: PayloadAction<DialogState>) =>
      (state = action.payload),
    removeDialog: () => initialState,
  },
});

export const { setDialog, removeDialog } = dialogSlice.actions;
export const selectDialog = (state: RootState) => state.dialog;

export default dialogSlice.reducer;
