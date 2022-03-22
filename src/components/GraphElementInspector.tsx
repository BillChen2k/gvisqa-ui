import * as React from 'react';
import {Box, Card, Grid, Typography} from '@mui/material';

export type IGraphElementType = 'node' | 'edge' | 'graph' | 'community';

export interface IGraphElementInspectorProps {
  type?: IGraphElementType;
  config?: any;
};

const inspectorIcons = {
  community: '/img/icon-community.png',
  edge: '/img/icon-edge.png',
  node: '/img/icon-node.png',
  graph: '/img/icon-graph.png',
};

const config = {
  semantic: 'Character',
  predicate_aliases: {
    link_with: [
      'coappear_with',
      'knows_character',
    ],
    degree_centrality: [
      'importance',
    ],
  },
};

const GraphElementInspector = (props: IGraphElementInspectorProps) => {
  return (
    <Card variant={'outlined'}>
      <Grid container direction={'row'} spacing={2}>
        <Grid item sx={{flex: '0 0 28px'}}>
          <Box sx={{pt: 1.5, pl: 1.5}}>
            <img src={'/img/icon-community.png'} alt={'Community'} width={'18px'}/>
          </Box>
        </Grid>
        <Grid item sx={{flex: 1, mt: '5px'}}>
          <Typography variant={'h6'}>
            Community
          </Typography>
          <table>
            <tr>
              <td>semantic</td>
              <td>{config.semantic}</td>
            </tr>
          </table>
        </Grid>
      </Grid>
    </Card>
  );
};

export default GraphElementInspector;
