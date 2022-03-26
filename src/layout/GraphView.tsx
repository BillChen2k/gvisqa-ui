import * as React from 'react';
import {Box, Card, CardContent, FormControl, Grid, IconButton, Input, InputAdornment, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '@/app/hooks';
import {Clear, Search} from '@mui/icons-material';
import {siteSlice} from '@/store/siteSlice';
import {uiSlice} from '@/store/uiSlice';
import G6Core from '@/components/G6Core';
import {humanize} from 'inflected';
import config from '@/config';
import TEInspector from '@/components/TEInspector';
import ArgDataInspector from '@/components/ArgDataInspector';

export interface IdivProps {

}

const div = (props: IdivProps) => {
  const dispatch = useAppDispatch();
  const {dataset, qares} = useAppSelector((state) => state.site);

  const [qtext, setQtext] = React.useState('');

  const handleClear = () => {
    setQtext('');
    dispatch(siteSlice.actions.setQARes(undefined));
  };

  const handleQuery = () => {
    dispatch(uiSlice.actions.beginLoading('Querying...'));
    setTimeout(() => {
      const queryQuestion = qtext.trim().toLowerCase().replace(/\s+/g, '');
      const queryResult = dataset.qares.filter((q) => {
        return q.question.trim().toLowerCase().replace(/\s+/g, '').includes(queryQuestion);
      });
      if (queryResult.length > 0) {
        dispatch(uiSlice.actions.openSnackbar({
          message: `${queryResult[0].question}`,
          severity: 'success',
        }));
        dispatch(siteSlice.actions.setQARes(queryResult[0]));
      } else {
        dispatch(uiSlice.actions.openSnackbar({
          message: `No answer found. Please try another question.`,
          severity: 'warning',
        }));
        dispatch(siteSlice.actions.setQARes(undefined));
      }
      dispatch(uiSlice.actions.endLoading());
    }, Math.random() * 1000 + 500);
  };

  if (!dataset) {
    return (<Card variant={'outlined'} sx={{height: '100%'}}>
      <CardContent>
          No dataset loaded.
      </CardContent>
    </Card>
    );
  }

  let sortedTE: any[] = null;
  if (qares) {
    sortedTE = JSON.parse(JSON.stringify(qares.tes));
    sortedTE.sort((a: any, b:any) => {
      return a.type == 'community' ? -1 : 1;
    });
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
              <Card variant={'outlined'} sx={{pt: 1}}>
                <CardContent>
                  <Typography variant={'body2'}>Our answer:</Typography>
                  <Typography variant={'h3'}>{humanize(qares.readable_answer)}</Typography>
                  <Typography variant={'body2'} sx={{color: '#666666'}}>
                    <b>SPARQL QUERY:</b> <code>{qares.query}</code>
                  </Typography>
                  <Typography variant={'body2'} sx={{color: '#666666'}}>
                    <b>QUERY ANSWER:</b> <code>{qares.answer}</code>
                  </Typography>
                </CardContent>
              </Card>
            }

          </Grid>

          <Grid item xs={4}>
            <Box sx={{width: '100%', height: 'calc(100vh - 110px)', overflowY: 'auto'}}>
              { qares && qares.arg_data.length > 0 &&
                  <ArgDataInspector data={JSON.parse(JSON.stringify(qares.arg_data))} />
              }
              { qares &&
                sortedTE.map((te, index) => {
                  if (te.type == 'node' || te.type == 'community') {
                    return (<TEInspector key={index} type={te.type} index={te.index}/>);
                  }
                })
              }
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default div;
