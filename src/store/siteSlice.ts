import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IDataset, IQAResult} from '@/types';

export interface ISiteState {
  selectedDataset: string;
  dataset: | IDataset;
  queryQuestion: | string;
  qares: | IQAResult;
}

const initialState: ISiteState = {
  selectedDataset: 'lesmis',
  dataset: undefined,
  queryQuestion: undefined,
  qares: undefined,
};

export const siteSlice = createSlice({
  name: 'site',
  initialState: initialState,
  reducers: {
    setSelectedDataset: (state, action: PayloadAction<string>) => {
      state.selectedDataset = action.payload;
    },
    setDataset: (state, action: PayloadAction<IDataset>) => {
      state.dataset = action.payload;
    },
    setQARes: (state, action: PayloadAction<| IQAResult>) => {
      state.qares = action.payload;
    },
  },
});
