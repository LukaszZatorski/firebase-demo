import React, { useContext } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FirebaseContext } from '../Firebase';

const PasswordChangeForm = () => {
  const firebase = useContext(FirebaseContext);
  return (
    <div>
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
          firebase!.doPasswordUpdate(values.password).then(
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
              Change My Password
            </button>
          </Form>
        )}
      />
    </div>
  );
};

export default PasswordChangeForm;
