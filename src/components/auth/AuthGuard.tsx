import React  from 'react';
import { useAuthStore } from '../../hooks-store/store';
import { Redirect } from 'react-router';
import { autoLogin } from '../../actions/auth';

export const authGuard = (Component: React.FC<any>) => React.memo(() => {
  const [state,dispatch]: any = useAuthStore();
  const isAuth = state.auth.userIsAuthenticated;
  console.log('authGuard', isAuth, Component)
  let isLoading = true;

  if (!isAuth && window.location.pathname !== '/auth') {
    isLoading = false;
    console.log('autoLogin', window.location)
    autoLogin().then(user => {
      console.log('autoLogin user', user)
      if (user) {
        dispatch("USER_AUTHENTICATED", { localId: user.id, idToken: user.token });
      } 
    });
  }
  try {
    if (!!isAuth)
      return <Component />;
    else return <Redirect to="/auth" />;
  } catch{
    return <Redirect to="/auth" />;
  }
});

