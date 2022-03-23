import * as React from 'react';
import {Box, Card, Grid, Typography} from '@mui/material';
import {humanize} from 'inflected';
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

const demoConfig = {
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
  const tableContents = [];
  const config = props.config || demoConfig;
  for (const key of Object.keys(config)) {
    if (typeof config[key] === 'string') {
      tableContents.push((
        <div key={key} className={'split-row'}>
          <span>{humanize(key)}</span>
          <span>{humanize(config[key])}</span>
        </div>
      ));
    }
    if (key === 'predicate_aliases') {
      for (const predicate of Object.keys(config[key])) {
        tableContents.push((
          <div key={predicate} className={'split-row'}>
            <span>{humanize(predicate) + ' semantics'}</span>
            <span></span>
          </div>
        ));
        for (const value of config[key][predicate]) {
          tableContents.push(
              (<div key={value} className={'array-row'}>
                <span></span>
                <span>{humanize(value)}</span>
              </div>),
          );
        }
      }
    }
  }

  return (
    <Card variant={'outlined'} sx={{mb: 2}}>
      <Grid container direction={'row'} spacing={2}>
        <Grid item sx={{flex: '0 0 24px'}}>
          <Box sx={{pt: 1.5, pl: 1.5}}>
            <img src={inspectorIcons[props.type || 'node']} alt={'Community'} width={'18px'}/>
          </Box>
        </Grid>
        <Grid item sx={{flex: 1, mt: '6px'}}>
          <Typography variant={'h6'}>
            {humanize(props.type || 'node')}
          </Typography>
          <div className={'ele-table'}>
            {tableContents}
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default GraphElementInspector;
