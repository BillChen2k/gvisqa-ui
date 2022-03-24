import * as React from 'react';
import {Box, Card, Grid, Typography} from '@mui/material';
import inspectorIcons, {InspectorType} from '@/config/inspector';
import {humanize} from 'inflected';
import {useAppSelector} from '@/app/hooks';

export interface ITEInspectorProps {
  type?: InspectorType;
  index?: number;
  indexes?: number[];
  source?: number;
  target?: number;
}

const TEInspector = (props: ITEInspectorProps) => {
  const {dataset} = useAppSelector((state) => state.site);
  const graphRef = React.useRef();
  const tableContents = [];
  let title = '';
  switch (props.type) {
    case 'node':
      {
        const target = dataset.properties.node[String(props.index)];
        title = target['name'];
        tableContents.push(
            <div className={'split-row'}>
              <span>Name</span>
              <span>{target.name}</span>
            </div>,
        );
        tableContents.push(
            <div className={'split-row'}>
              <span>Community belongings</span>
              <span>{dataset.graphjson.nodes[props.index].group - 1}</span>
            </div>,
        );
        ['degree', 'clustering', 'degree_centrality'].forEach((one) => {
          if (target[one]) {
            tableContents.push(
                <div className={'split-row'}>
                  <span>{humanize(one)}</span>
                  <span>{Number(target[one]).toFixed(3)}</span>
                </div>,
            );
          }
        });
      }
      break;

    case 'community':
      {
        title = `Commuinty ${props.index}`;
        const target = dataset.properties.community[String(props.index)];
        tableContents.push(
            <div className={'split-row'}>
              <span>Community size</span>
              <span>{target.member_index.length}</span>
            </div>,
        );
        ['average_degree', 'average_centrality', 'average_clustering'].forEach((one) => {
          if (target[one]) {
            tableContents.push(
                <div className={'split-row'}>
                  <span>{humanize(one)}</span>
                  <span>{Number(target[one]).toFixed(3)}</span>
                </div>,
            );
          }
        });
        tableContents.push(
            <div className={'split-row'}>
              <span>Members</span>
              <span></span>
            </div>,
        );
        target.member_names.forEach((one: string) => {
          tableContents.push((<div className={'array-row'}>
            <span></span>
            <span>{one}</span>
          </div>));
        });
      }
      break;

    case 'edge':
    {
      const target = dataset.properties.edge[String(props.source)][String(props.target)];
      title = `Edge from ${dataset.graphjson.nodes[props.source].name} to ${dataset.graphjson.nodes[props.target].name}`;
      tableContents.push((
        <div className={'split-row'}>
          <span>Weight</span>
          <span>{target.weight}</span>
        </div>
      ));
    }
  }

  return (
    <Card variant={'outlined'} sx={{mb: 2}}>
      <Grid container direction={'row'} spacing={2}>
        <Grid item sx={{flex: '0 0 24px'}}>
          <Box sx={{pt: 1.5, pl: 1.5}}>
            <img src={inspectorIcons[props.type || 'node']} width={'18px'}/>
          </Box>
        </Grid>
        <Grid item sx={{flex: 1, mt: '6px'}}>
          <Typography variant={'h6'}>
            {humanize(title)}
          </Typography>
          <Box ref={graphRef}/>
          {props.type == 'community' && (
            <Typography variant={'body2'}>
              {`Community ${props.index}`}
            </Typography>
          )}
          <div className={'ele-table'}>
            {tableContents}
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TEInspector;