import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';
const ERROR_MSG_ACCOUNT_EXISTS = `
An account with this E-Mail address already exists.
Try to login with this account instead. If you think the
account is already used from one of the social logins, try
to sign-in with one of them. Afterward, associate your accounts
on your personal account page.
`;

type Roles = {
  [string_key: string]: string;
};

const SignUpPage = () => {
  const firebase = useContext(FirebaseContext);
  let history = useHistory();
  return (
    <div>
      <h1>SignUp</h1>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          passwordConfirmation: '',
          isAdmin: false,
        }}
        validate={values => {
          let errors: any = {};
          if (!values.email) {
            errors.email = 'Email required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }

          if (!values.username) {
            errors.username = 'Username required';
          }

          if (!values.password) {
            errors.password = 'Password required';
          } else if (values.password !== values.passwordConfirmation) {
            errors.passwordConfirmation = 'Must match password';
          }
          return errors;
        }}
        onSubmit={(values, actions) => {
          const roles: Roles = {};
          if (values.isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
          }
          firebase!
            .doCreateUserWithEmailAndPassword(values.email, values.password)
            .then(authUser => {
              // Create a user in your Firebase realtime database
              return firebase!.user(authUser.user!.uid).set({
                username: values.username,
                email: values.email,
                roles,
              });
            })
            .then(
              () => {
                actions.setSubmitting(false);
                actions.resetForm();
                history.push(ROUTES.HOME);
              },
              error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                  error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }
                actions.setSubmitting(false);
                actions.setStatus({ msg: error.message });
              },
            );
        }}
        render={({ status, isValid, isSubmitting, values }) => (
          <Form>
            <Field type='text' name='username' placeholder='Username' />
            <ErrorMessage name='username' component='div' />
            <Field type='email' name='email' placeholder='Email' />
            <ErrorMessage name='email' component='div' />
            <Field type='password' name='password' placeholder='Password' />
            <ErrorMessage name='password' component='div' />
            <Field
              type='password'
              name='passwordConfirmation'
              placeholder='Confirm Password'
            />
            <ErrorMessage name='passwordConfirmation' component='div' />
            <label className='Form-group'>
              <span>Is admin?</span>
              <Field type='checkbox' name='isAdmin' checked={values.isAdmin} />
              <span className='Checkmark'></span>
            </label>
            {status && status.msg && <div>{status.msg}</div>}
            <button type='submit' disabled={isSubmitting || !isValid}>
              Sign Up
            </button>
          </Form>
        )}
      />
    </div>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;
export { SignUpLink };
