import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = withRouter(({ history }) => {
  const firebase = useContext(FirebaseContext);
  return (
    <div>
      <h1>SignUp</h1>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          passwordConfirmation: '',
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
          firebase!
            .doCreateUserWithEmailAndPassword(values.email, values.password)
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
            {status && status.msg && <div>{status.msg}</div>}
            <button type='submit' disabled={isSubmitting || !isValid}>
              Sign Up
            </button>
          </Form>
        )}
      />
    </div>
  );
});

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;
export { SignUpLink };
