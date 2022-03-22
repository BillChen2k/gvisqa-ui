import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ISiteState {
  selectedDataset: string;
}

const initialState: ISiteState = {
  selectedDataset: 'lesmis',
};

export const siteSlice = createSlice({
  name: 'site',
  initialState: initialState,
  reducers: {
    setSelectedDataset: (state, action: PayloadAction<string>) => {
      state.selectedDataset = action.payload;
    },
  },
});
