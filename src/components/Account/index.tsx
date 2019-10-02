import React, { useContext } from 'react';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';

const AccountPage = () => {
  const authUser = useContext(AuthUserContext);
  return (
    <div>
      <h1>Account: {authUser!.email}</h1>
      <h1>Account Page</h1>
      <PasswordChangeForm />
    </div>
  );
};

const condition = (authUser: firebase.User | null) => !!authUser;
export default withAuthorization(condition)(AccountPage);
