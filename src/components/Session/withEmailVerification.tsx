import React, { useState, useContext } from 'react';
import AuthUserContext, { AuthUser } from './context';
import { FirebaseContext } from '../Firebase';

const withEmailVerification = (
  Component: React.ComponentType,
  props?: React.ComponentProps<any>,
) => () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [isSent, setIsSent] = useState(false);

  const onSendEmailVerification = () => {
    firebase!.doSendEmailVerification().then(() => setIsSent(true));
  };

  return needsEmailVerification(authUser!) ? (
    <div>
      {isSent ? (
        <p>
          E-Mail confirmation sent: Check you E-Mails (Spam folder included) for
          a confirmation E-Mail. Refresh this page once you confirmed your
          E-Mail.
        </p>
      ) : (
        <p>
          Verify your E-Mail: Check you E-Mails (Spam folder included) for a
          confirmation E-Mail or send another confirmation E-Mail.
        </p>
      )}
      <button type='button' onClick={onSendEmailVerification} disabled={isSent}>
        Send confirmation E-Mail
      </button>
    </div>
  ) : (
    <Component {...props} />
  );
};

const needsEmailVerification = (authUser: AuthUser) =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

export default withEmailVerification;
