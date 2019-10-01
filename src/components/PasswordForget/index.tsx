import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => {
  const firebase = useContext(FirebaseContext);
  return (
    <div>
      <h1>PasswordForget</h1>
      <Formik
        initialValues={{
          email: '',
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
          return errors;
        }}
        onSubmit={(values, actions) => {
          firebase!.doPasswordReset(values.email).then(
            () => {
              actions.setSubmitting(false);
              actions.resetForm();
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
            {status && status.msg && <div>{status.msg}</div>}
            <button type='submit' disabled={isSubmitting || !isValid}>
              Reset My Password
            </button>
          </Form>
        )}
      />
    </div>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;
export { PasswordForgetLink };
