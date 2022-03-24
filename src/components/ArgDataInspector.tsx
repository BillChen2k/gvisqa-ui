import * as React from 'react';
import {useAppSelector} from '@/app/hooks';
import {Card, Typography} from '@mui/material';
import {useEffect, useRef} from 'react';
import vl from 'vega-lite';
import {VegaLite, VisualizationSpec} from 'react-vega';
import {humanize} from 'inflected';

export interface IAuxiliaryBarChartProps {
  data?: any;
}

const ArgDataInspector = (props: IAuxiliaryBarChartProps) => {
  const {dataset, qares} = useAppSelector((state) => state.site);

  const vegaData = {
    myData: props.data,
  };

  const vegaSpec: VisualizationSpec = {
    '$schema': 'https://vega.github.io/schema/vega-lite/v5.json',
    'height': {'step': 15},
    'width': 220,
    'data': {
      'name': 'myData',
    },
    'encoding': {
      'y': {'field': 'entity', 'type': 'ordinal', 'axis': {'labelAngle': 45},
        'sort': qares.answer_type.split('@')[0] == 'max' ? '-x' : 'x',
      },
      'x': {'field': 'degree', 'type': 'quantitative', 'stack': false},
    },
    'layer': [
      {
        'mark': {'type': 'bar', 'fill': '#22947c', 'cursor': 'pointer'},
        'encoding': {},
      },
      {
        'mark': {'type': 'text', 'align': 'left', 'baseline': 'middle', 'dx': 3},
        'encoding': {'text': {'field': 'degree', 'type': 'nominal'}},
      },
    ],
  };

  if (!props.data) {
    return null;
  }

  return (
    <Card variant={'outlined'} sx={{mb: 2, height: '420px', width: '100%', overflowY: 'scroll'}}>
      <Typography variant={'h6'} sx={{'p': 2}}>
        {humanize(qares.answer_type.split('@')[1]) + ' ' + `rankings (${qares.answer_type.split('@')[0] == 'max' ? 'descending' : 'ascending'})`}
      </Typography>
      <VegaLite spec={vegaSpec} data={vegaData}/>
    </Card>
  );
};

export default ArgDataInspector;
