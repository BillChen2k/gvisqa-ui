import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type SnackbarSeverity = 'success' | 'warning' | 'info' | 'error';

export interface OpenSnackbarPayload {
  message: string,
  severity?: SnackbarSeverity;
};

export interface IUIState {
  isLoading: boolean,
  loadingText: string,
  snackbar: {
    open: boolean,
    message: string,
    severity: SnackbarSeverity,
  },
}

const initialState: IUIState = {
  isLoading: false,
  loadingText: '',
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialState,
  reducers: {
    openSnackbar(state: IUIState, action: PayloadAction<OpenSnackbarPayload>) {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    dismissSnackbar(state: IUIState) {
      state.snackbar.open = false;
    },
    beginLoading(state: IUIState, action: PayloadAction<| string>) {
      state.isLoading = true;
      state.loadingText = action.payload || '';
    },
    endLoading(state: IUIState) {
      state.isLoading = false;
      state.loadingText = '';
    },
  },
});
