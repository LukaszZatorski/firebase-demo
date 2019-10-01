import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';

import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

type NavigationProps = {
  authUser: null | firebase.User;
};

const Navigation = () => {
  const authUser = useContext(AuthUserContext);
  return (
    <div className='Navigation'>
      {authUser ? <NavigationAuth /> : <NavigationNonAuth />}
    </div>
  );
};

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;
