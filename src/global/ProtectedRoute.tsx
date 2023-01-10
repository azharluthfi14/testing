import { useEffect, useState } from 'react';
import { Redirect, RouteProps } from 'react-router';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  selectUserLoggedIn
} from '../modules';

const ProtectedRoute = ({ ...props }: RouteProps) => {
  const loggedIn = useSelector(selectUserLoggedIn);
  return (
    <>
      {loggedIn ? (<Route {...props} />) : (<Redirect to="/login" />)}
    </>
  );
};

export default ProtectedRoute;