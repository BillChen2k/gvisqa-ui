import * as React from 'react';
import {Box, Button, Card, CardContent, Stack, Typography} from '@mui/material';
import GraphElementInspector from '@/components/GraphElementInspector';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {useEffect} from 'react';
import {siteSlice} from '@/store/siteSlice';
import {IDataset} from '@/types';

export interface IGraphMetaViewProps {
}

const GraphMetaView = (props: IGraphMetaViewProps) => {
  const dispatch = useAppDispatch();
  const {selectedDataset, dataset} = useAppSelector((state) => state.site);

  useEffect(() => {
    fetch(`/dataset/${selectedDataset}.json`)
        .then((response) => response.json() as unknown as IDataset)
        .then((data) => {
          dispatch(siteSlice.actions.setDataset(data as unknown as IDataset));
          console.log(data.qares.map((q) => {
            return {question: q.question, highlight: q.highlight, ans: q.readable_answer};
          }));
        });
  }, [selectedDataset]);


  if (!dataset) {
    return (<Card variant={'outlined'} sx={{height: '100%'}}>
      <CardContent>
        <Typography variant={'h5'}>No dataset selected.</Typography>
      </CardContent>
    </Card>);
  }

  return (
    <Card variant={'outlined'} sx={{height: '98%'}}>
      <Stack direction={'column'} sx={{display: 'flex', height: '100%'}}>
        <Stack p={2} spacing={1}>
          <Typography variant={'h4'}>{dataset.full_name}</Typography>
          <Typography variant={'body2'} sx={{color: 'gray'}}>
            {/*Node: {dataset.node_count}, Edges: {dataset.edge_count},*/}
            {dataset.graphconfig.graph.directed ? 'Directed' : 'Undirected'}
          </Typography>
          <Typography variant={'body1'} sx={{height: 'auto'}}>
            {dataset.description}
          </Typography>
        </Stack>
        <Box px={2} sx={{overflowX: 'hidden', overflowY: 'scroll', height: 'calc(100vh - 290px)'}}>
          <GraphElementInspector type={'node'} config={dataset.graphconfig.node} />
          <GraphElementInspector type={'edge'} config={dataset.graphconfig.edge} />
          <GraphElementInspector type={'community'} config={dataset.graphconfig.community} />

          <GraphElementInspector type={'graph'} config={dataset.graphconfig.graph}/>
        </Box>
        <Stack direction={'row'} sx={{mx: 2, mt: 2}} spacing={2} justifyContent={'right'}>
          <Button variant={'outlined'}>
              View Config YML File
          </Button>
          {/*<Button variant={'outlined'}>*/}
          {/*    Load*/}
          {/*</Button>*/}
        </Stack>
      </Stack>


    </Card>
  );
};

export default GraphMetaView;
