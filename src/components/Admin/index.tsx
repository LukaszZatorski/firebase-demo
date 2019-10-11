import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router';
import { compose } from 'recompose';

import { FirebaseContext } from '../Firebase';
import { withAuthorization, withEmailVerification, AuthUser } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const Admin = () => {
  return (
    <div className='Admin-dashboard'>
      <h1>Admin</h1>
      <p>The Admin Page is accessible by every signed in admin user.</p>

      <Switch>
        <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
        <Route exact path={ROUTES.ADMIN} component={UserList} />
      </Switch>
    </div>
  );
};

type User = {
  uid: string;
  email: string;
  username: string;
};

const UserList = () => {
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
    <div>
      <h2>Users</h2>
      {loading && <div>Loading ...</div>}
      <ul>
        {users &&
          users.map((user: User) => (
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
              <span>
                <Link
                  to={{
                    pathname: `${ROUTES.ADMIN}/${user.uid}`,
                    state: { user },
                  }}
                >
                  Details
                </Link>
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

type Params = {
  id: string;
};

const UserItem = () => {
  const firebase = useContext(FirebaseContext);
  // @ts-ignore
  let params: Params = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(location.state.user);

  useEffect(() => {
    if (user) {
      return;
    }
    setLoading(true);

    firebase!.user(params.id).on('value', snapshot => {
      setUser(snapshot.val());
      setLoading(false);
    });
    return () => {
      firebase!.user(params.id).off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase]);

  const onSendPasswordResetEmail = () => {
    firebase!.doPasswordReset(user.email);
  };

  return (
    <div>
      <h2>User {params.id}</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div className='User-item'>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>

          <button type='button' onClick={onSendPasswordResetEmail}>
            Send Password Reset
          </button>
        </div>
      )}
    </div>
  );
};

const condition = (authUser: AuthUser | null) =>
  !!authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Admin);
