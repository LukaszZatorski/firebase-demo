import React, { useContext, useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FirebaseContext } from '../Firebase';
import { AuthUserContext, withAuthorization, AuthUser } from '../Session';
import PasswordChangeForm from '../PasswordChange';

const SIGN_IN_METHODS = [
  {
    id: 'password',
    provider: '',
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
];

const AccountPage = () => {
  const authUser = useContext(AuthUserContext);
  return (
    <div>
      <h1>Account: {authUser!.email}</h1>
      <h1>Account Page</h1>
      <PasswordChangeForm />
      <LoginManagement authUser={authUser} />
    </div>
  );
};

type LoginManagementProps = {
  authUser: AuthUser | null;
};

const LoginManagement = ({ authUser }: LoginManagementProps) => {
  const firebase = useContext(FirebaseContext);
  const [activeSignInMethods, setActiveSignInMethods] = useState<string[]>([]);
  const [error, setError] = useState();

  useEffect(() => {
    fetchSignInMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSignInMethods = () => {
    firebase!.auth
      .fetchSignInMethodsForEmail(authUser!.email)
      .then(activeSignInMethods => {
        setActiveSignInMethods(activeSignInMethods);
        setError(null);
      })
      .catch(error => setError(error));
  };

  const onDefaultLoginLink = (password: string) => {
    const credential = firebase!.emailAuthProvider.credential(
      authUser!.email,
      password,
    );
    firebase!.auth
      .currentUser!.linkWithCredential(credential)
      .then(fetchSignInMethods)
      .catch(error => setError(error));
  };

  const onUnlink = (providerId: string) => {
    firebase!.auth
      .currentUser!.unlink(providerId)
      .then(fetchSignInMethods)
      .catch(error => setError(error));
  };

  const onSocialLoginLink = (provider: string) => {
    firebase!.auth
      .currentUser!.linkWithPopup(firebase![provider])
      .then(fetchSignInMethods)
      .catch(() => setError(null));
  };

  return (
    <div className='Login-management'>
      <h3>Sign In Methods:</h3>
      <ul>
        {SIGN_IN_METHODS.map(signInMethod => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(signInMethod.id);
          return (
            <li key={signInMethod.id}>
              {signInMethod.id === 'password' ? (
                <DefaultLoginToggle
                  onlyOneLeft={onlyOneLeft}
                  isEnabled={isEnabled}
                  signInMethod={signInMethod}
                  onDefaultLoginLink={onDefaultLoginLink}
                  onUnlink={onUnlink}
                />
              ) : isEnabled ? (
                <button
                  type='button'
                  onClick={() => onUnlink(signInMethod.id)}
                  disabled={onlyOneLeft}
                >
                  Deactivate {signInMethod.id}
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => onSocialLoginLink(signInMethod.provider)}
                >
                  Link {signInMethod.id}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {error && error.message}
    </div>
  );
};

type DefaultLoginToggleProps = {
  onlyOneLeft: boolean;
  isEnabled: boolean;
  signInMethod: {
    id: string;
    provider: string;
  };
  onDefaultLoginLink: (password: string) => void;
  onUnlink: (providerId: string) => void;
};

const DefaultLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onDefaultLoginLink,
  onUnlink,
}: DefaultLoginToggleProps) => {
  return (
    <Formik
      initialValues={{
        password: '',
        passwordConfirmation: '',
      }}
      validate={values => {
        let errors: any = {};
        if (!values.password) {
          errors.password = 'Password required';
        } else if (values.password !== values.passwordConfirmation) {
          errors.passwordConfirmation = 'Must match password';
        }
        return errors;
      }}
      onSubmit={(values, actions) => {
        onDefaultLoginLink(values.password);
        actions.resetForm();
      }}
      render={({ isValid }) =>
        isEnabled ? (
          <Form>
            <button
              type='button'
              onClick={() => onUnlink(signInMethod.id)}
              disabled={onlyOneLeft}
            >
              Deactivate {signInMethod.id}
            </button>
          </Form>
        ) : (
          <Form>
            <Field type='password' name='password' placeholder='Password' />
            <ErrorMessage name='password' component='div' />
            <Field
              type='password'
              name='passwordConfirmation'
              placeholder='Confirm Password'
            />
            <ErrorMessage name='passwordConfirmation' component='div' />
            <button type='submit' disabled={!isValid}>
              Link {signInMethod.id}
            </button>
          </Form>
        )
      }
    />
  );
};

const condition = (authUser: AuthUser | null) => !!authUser;
export default withAuthorization(condition)(AccountPage);
