import React, { useState, useEffect, useContext } from 'react';
import { compose } from 'recompose';

import { FirebaseContext } from '../Firebase';
import { withAuthorization, withEmailVerification, AuthUser } from '../Session';
import * as ROLES from '../../constants/roles';

const Admin = () => {
  const firebase = useContext(FirebaseContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState();

  useEffect(() => {
    setLoading(true);

    firebase!.users().on('value', snapshot => {
      const usersObject = snapshot.val() ? snapshot.val() : {};
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));
      setUsers(usersList);
      setLoading(false);
    });
    return () => {
      firebase!.users().off();
    };
  }, [firebase]);
  return (
    <div className='Admin-dashboard'>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>
      {loading && <div>Loading ...</div>}
      {users && <UserList users={users} />}
    </div>
  );
};

const UserList = ({ users }: any) => {
  return (
    <ul>
      {users.map((user: any) => (
        <li key={user.uid}>
          <span>
            <strong>ID:</strong> {user.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
        </li>
      ))}
    </ul>
  );
};

const condition = (authUser: AuthUser | null) =>
  !!authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Admin);
