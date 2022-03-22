import * as React from 'react';
import {AppBar, Box, Button, Select, Toolbar, MenuItem, ThemeProvider, Typography, Grid, Card} from '@mui/material';
import config from '@/config';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {siteSlice} from '@/store/siteSlice';
import GraphElementInspector from '@/components/GraphElementInspector';

export interface IBaseProps {

}

const Base = (props: IBaseProps) => {
  const {selectedDataset} = useAppSelector((state) => state.site);

  const dispatch = useAppDispatch();
  return (<Box>
    <AppBar position={'static'}>
      <Toolbar variant={'dense'}>
        <ThemeProvider theme={config.darkTheme}>
          <Typography variant={'overline'} sx={{mr: 2}}>Dataset: </Typography>
          <Select variant={'standard'} value={selectedDataset} size={'small'}
            onChange={(e) => dispatch(siteSlice.actions.setSelectedDataset(e.target.value))}
          >
            <MenuItem value={'lesmis'}>Les Miserbles</MenuItem>
          </Select>
          <Typography variant={'h6'} sx={{mx: 2}}>
            GVisQA - Graph Visualization Question Answering
          </Typography>
        </ThemeProvider>
      </Toolbar>
    </AppBar>
    <Box>
      <Grid container spacing={2} sx={{height: 'calc(100vh - 48px)', pt: 2, px: 2}}>
        <Grid item xs={3}>
          <Card variant={'outlined'} sx={{height: '100%'}} >
            <Box p={2}>
              <GraphElementInspector />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Card variant={'outlined'} sx={{height: '100%'}} >
            <Box p={2}>
              <Typography variant={'h6'}>
                Graph
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  </Box>);
};

export default Base;
