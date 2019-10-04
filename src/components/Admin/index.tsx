import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../Firebase';

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
    <div className='adminDashboard'>
      <h1>Admin</h1>

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
export default Admin;
