import * as React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@mui/material';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {uiSlice} from '@/store/uiSlice';

export interface IGlobalDialogProps {
}

const GlobalDialog = (props: IGlobalDialogProps) => {
  const dispatch = useAppDispatch();
  const {open, title, content} = useAppSelector((state) => state.ui.dialog);

  const handleSimpleDialogClose = () => {
    dispatch(uiSlice.actions.dismissSimpleDialog());
  };

  return (
    <div>
      <Dialog open={open} onClose={handleSimpleDialogClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSimpleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GlobalDialog;
