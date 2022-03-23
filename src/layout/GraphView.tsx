import * as React from 'react';
import {Box, Card, CardContent, FormControl, Grid, IconButton, Input, InputAdornment, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {Clear, Search} from '@mui/icons-material';
import {siteSlice} from '@/store/siteSlice';
import {uiSlice} from '@/store/uiSlice';
import G6Core from '@/components/G6Core';
import {humanize} from 'inflected';
import config from '@/config';

export interface IGraphViewProps {

}

const GraphView = (props: IGraphViewProps) => {
  const dispatch = useAppDispatch();
  const {dataset, qares} = useAppSelector((state) => state.site);

  const [qtext, setQtext] = React.useState('');

  const handleClear = () => {
    setQtext('');
    dispatch(siteSlice.actions.setQARes(undefined));
  };

  const handleQuery = () => {
    const queryQuestion = qtext.trim().toLowerCase().replace(/\s+/g, '');
    const queryResult = dataset.qares.filter((q) => {
      return q.question.trim().toLowerCase().replace(/\s+/g, '').includes(queryQuestion);
    });
    if (queryQuestion.length > 0) {
      dispatch(uiSlice.actions.openSnackbar({
        message: `Found ${queryResult.length} result(s)`,
        severity: 'success',
      }));
      dispatch(siteSlice.actions.setQARes(queryResult[0]));
    }
  };

  if (!dataset) {
    return (<Card variant={'outlined'} sx={{height: '100%'}}>
      <CardContent>
          No dataset loaded.
      </CardContent>
    </Card>
    );
  }

  return (
    <Card variant={'outlined'} sx={{height: '100%'}} >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <FormControl fullWidth variant={'standard'}>
              <Input
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    handleQuery();
                  }
                }}
                inputProps={{
                  sx: {
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'text.primary',
                  },
                }}
                value={qtext}
                onChange={(e) => setQtext(e.target.value)}
                placeholder={'Please input your question...'}
                endAdornment={
                  <InputAdornment position={'end'}>
                    <IconButton onClick={handleClear}>
                      <Clear />
                    </IconButton>
                    <IconButton onClick={handleQuery}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box sx={{height: config.appearance.g6CoreHeight}}>
              <G6Core/>

            </Box>

            {qares &&
              <Card variant={'outlined'}>
                <CardContent>
                  <Typography variant={'body2'}>Our answer:</Typography>
                  <Typography variant={'h3'}>{humanize(qares.readable_answer)}</Typography>
                  <Typography variant={'body2'} sx={{color: '#666666'}}>{qares.query}</Typography>
                </CardContent>
              </Card>
            }

          </Grid>

          <Grid item xs={4}>
            Auxiliary Answers
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default GraphView;
