import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Recaptcha from 'react-grecaptcha';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, Alert } from '../../common/components/web';
import { match, email, minLength, required, validateForm } from '../../../../../common/validation';

const registerFormSchema = {
  username: [required, minLength(3)],
  email: [required, email],
  password: [required, minLength(8)],
  passwordConfirmation: [match('password'), required, minLength(8)]
};

const validate = values => validateForm(values, registerFormSchema);
let c = '';
const verifyCallback = response => (c = response);
const expiredCallback = () => {
  console.log('expired!');
};
const RECAPTCHA_SITE_KEY = '6LeqQmEUAAAAANGD7o5pEkzVmi-W0LAG4OYnaBe-';

const RegisterForm = ({ values, handleSubmit, submitting, error, t }) => {
  console.log(c);
  return (
    <Form name="register" onSubmit={handleSubmit}>
      <Field
        name="username"
        component={RenderField}
        type="text"
        label={t('reg.form.field.name')}
        value={values.username}
      />
      <Field name="email" component={RenderField} type="text" label={t('reg.form.field.email')} value={values.email} />
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('reg.form.field.pass')}
        value={values.password}
      />
      <Field
        name="passwordConfirmation"
        component={RenderField}
        type="password"
        label={t('reg.form.field.passConf')}
        value={values.passwordConfirmation}
      />
      <Recaptcha
        sitekey={RECAPTCHA_SITE_KEY}
        callback={verifyCallback}
        expiredCallback={expiredCallback}
        locale="ru-RU"
        className="customClassName"
        // Other props will be passed into the component.
        data-theme="light"
      />
      <div className="text-center">
        {error && <Alert color="error">{error}</Alert>}
        <Button color="primary" type="submit" disabled={submitting}>
          {t('reg.form.btnSubmit')}
        </Button>
      </div>
    </Form>
  );
};

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object,
  t: PropTypes.func
};

const RegisterFormWithFormik = withFormik({
  mapPropsToValues: () => ({ username: '', email: '', password: '', passwordConfirmation: '', captcha: c }),
  validate: values => validate(values),
  async handleSubmit(
    values,
    {
      setErrors,
      props: { onSubmit }
    }
  ) {
    onSubmit(values).catch(e => {
      setErrors(e);
    });
  },
  enableReinitialize: true,
  displayName: 'SignUpForm' // helps with React DevTools
});

export default translate('user')(RegisterFormWithFormik(RegisterForm));
