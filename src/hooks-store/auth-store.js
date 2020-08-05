export const authActions = {
  USER_AUTHENTICATED: (state, userData) => {
    console.log('USER_AUTHENTICATED');
    return  { auth: { userIsAuthenticated: true, userId: userData.localId, token: userData.idToken}  
    };
  },
  USER_LOGGED_OUT:  (state) => {
    console.log('USER_LOGGED_OUT');
    return  { auth: { userIsAuthenticated: false, userId: null, token: null }  
    };
  },
};
 