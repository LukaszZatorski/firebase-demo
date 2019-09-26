import React, { useContext } from 'react';
import { FirebaseContext } from '../Firebase';

const SignOutButton = () => {
  const firebase = useContext(FirebaseContext);
  return (
    <button
      type='button'
      className='Sign-out-btn'
      onClick={firebase!.doSignOut}
    >
      Sign Out
    </button>
  );
};
export default SignOutButton;
