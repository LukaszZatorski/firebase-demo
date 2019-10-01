import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = withRouter(({ history }) => {
  const firebase = useContext(FirebaseContext);
  return (
    <div>
      <h1>SignIn</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
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

          if (!values.password) {
            errors.password = 'Password required';
          }
          return errors;
        }}
        onSubmit={(values, actions) => {
          firebase!
            .doSignInWithEmailAndPassword(values.email, values.password)
            .then(
              () => {
                actions.setSubmitting(false);
                actions.resetForm();
                history.push(ROUTES.HOME);
              },
              error => {
                actions.setSubmitting(false);
                actions.setStatus({ msg: error.message });
              },
            );
        }}
        render={({ status, isValid, isSubmitting }) => (
          <Form>
            <Field type='email' name='email' placeholder='Email' />
            <ErrorMessage name='email' component='div' />
            <Field type='password' name='password' placeholder='Password' />
            <ErrorMessage name='password' component='div' />
            {status && status.msg && <div>{status.msg}</div>}
            <button type='submit' disabled={isSubmitting || !isValid}>
              Sign In
            </button>
          </Form>
        )}
      />
      <SignUpLink />
      <PasswordForgetLink />
    </div>
  );
});

export default SignInPage;
