import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import { AuthUserContext, AuthUser } from '../Session';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const App = () => {
  const firebase = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState<AuthUser | null>(
    JSON.parse(localStorage.getItem('authUser')!),
  );
  useEffect(() => {
    const listener = firebase!.onAuthUserListener(
      (authUser: AuthUser) => {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setAuthUser(authUser);
      },
      () => {
        localStorage.removeItem('authUser');
        setAuthUser(null);
      },
    );
    return () => {
      listener();
    };
  });
  return (
    <AuthUserContext.Provider value={authUser}>
      <Router>
        <div className='App'>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route path={ROUTES.HOME} component={HomePage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.ADMIN} component={AdminPage} />
        </div>
      </Router>
    </AuthUserContext.Provider>
  );
};
export default App;
