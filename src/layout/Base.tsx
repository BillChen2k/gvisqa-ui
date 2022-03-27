import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Select,
  Toolbar,
  MenuItem,
  ThemeProvider,
  Typography,
  Grid,
  Card,
  Stack, SelectChangeEvent, LinearProgress,
} from '@mui/material';
import config from '@/config';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {siteSlice} from '@/store/siteSlice';
import GraphElementInspector from '@/components/GraphElementInspector';
import GraphMetaView from '@/layout/GraphMetaView';
import GraphView from '@/layout/GraphView';
import {uiSlice} from '@/store/uiSlice';

export interface IBaseProps {

}

const Base = (props: IBaseProps) => {
  const {selectedDataset, dataset} = useAppSelector((state) => state.site);
  const {isLoading} = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const handleDatasetSelection = (event: SelectChangeEvent<string>) => {
    dispatch(siteSlice.actions.setQARes(undefined));
    dispatch(siteSlice.actions.setSelectedDataset(event.target.value as string));
  };

  const datasetItems: any = {
    'lesmis': 'Lesmis',
    'football': 'Football',
    'dolphins': 'Dolphins',
    'celegansneural': 'Celegansneural',
    'adjnoun': 'Adjnoun',
    'as-22july06': 'AS-22july06',
    'astro-ph': 'Astro-Ph',
    'cond-mat': 'Cond-Mat',
    'cond-mat-2003': 'Cond-Mat-2003',
    'cond-mat-2005': 'Cond-Mat-2005',
    'hep-th': 'Hep-Th',
    'karate': 'Karate',
    'netscience': 'NetScience',
    'polblogs': 'PolBlogs',
    'polbooks': 'PolBooks',
    'power': 'Power',
  };
  return (<Box>
    <AppBar position={'static'}>
      <Toolbar variant={'dense'}>
        <ThemeProvider theme={config.darkTheme}>
          <Typography variant={'overline'} sx={{mr: 2}}>Dataset: </Typography>
          <Select variant={'standard'} value={selectedDataset} size={'small'}
            onChange={handleDatasetSelection}
          >
            {Object.keys(datasetItems).map((value: string) => {
              return <MenuItem key={value} value={value}>{datasetItems[value]}</MenuItem>;
            })}
          </Select>
          <Typography variant={'h6'} sx={{mx: 2}}>
            GVisQA - Graph Visualization Question Answering
          </Typography>
          <Box sx={{flexGrow: 1}} />
          <Button onClick={() => {
            dispatch(uiSlice.actions.openSimpleDialog({
              title: 'About',
              message: 'Graph network visualization question answering system.\nEast China Normal University, 2022.3',
            }));
          }}
          > ABOUT</Button>
        </ThemeProvider>
      </Toolbar>
      {isLoading &&
            <LinearProgress variant={'indeterminate'} sx={{width: '100%', position: 'absolute'}}/>
      }
    </AppBar>
    <Box>
      <Grid container spacing={2} sx={{height: 'calc(100vh - 48px)', pt: 2, px: 2}}>
        <Grid item xs={3}>
          <GraphMetaView />
        </Grid>
        <Grid item xs={9}>
          <GraphView />
        </Grid>
      </Grid>
    </Box>
  </Box>);
};

export default Base;
