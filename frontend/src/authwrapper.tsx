import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthWrapper = ({ children, redirectTo }) => {
  const Authenticated = Cookies.get('Authorization') || "None";
  const isAuthenticated = Authenticated != "None"


  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children ? children : <Outlet />;
};

export default AuthWrapper;
