import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import AuthUserContext from './context';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

type Condition = (authUser: firebase.User | null) => boolean;

const withAuthorization = (condition: Condition) => (
  Component: React.ComponentType,
  props?: React.ComponentProps<any>,
) => () => {
  const firebase = useContext(FirebaseContext);
  let history = useHistory();
  useEffect(() => {
    const listener = firebase!.auth.onAuthStateChanged(authUser => {
      if (!condition(authUser)) {
        history.push(ROUTES.SIGN_IN);
      }
    });
    return () => {
      listener();
    };
  });
  return (
    <AuthUserContext.Consumer>
      {authUser => (condition(authUser) ? <Component {...props} /> : null)}
    </AuthUserContext.Consumer>
  );
};
export default withAuthorization;
