import {configureStore} from '@reduxjs/toolkit';
import {uiSlice} from '@/store/uiSlice';
import {siteSlice} from '@/store/siteSlice';

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    site: siteSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
