import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import Base from '@/layout/Base';

export interface IAppRoutesProps {
}

const AppRoutes = (props: IAppRoutesProps) => {
  return (
    <Routes>
      <Route path={'/'} element={<Base />}>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
