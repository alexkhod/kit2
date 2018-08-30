import React from 'react';
import Loadable from 'react-loadable';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { NavLink, Link } from 'react-router-dom';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Alert, Button } from '../../common/components/web';
import { required, minLength, validateForm } from '../../../../../common/validation';
import Loading from './Loading';

import settings from '../../../../../../settings';

const AsyncFacebookButton = Loadable({
  loader: () => import('../auth/facebook'),
  loading: Loading,
  delay: 300
});

const AsyncGoogleButton = Loadable({
  loader: () => import('../auth/google'),
  loading: Loading,
  delay: 300
});

const AsyncLinkedInButton = Loadable({
  loader: () => import('../auth/linkedin'),
  loading: Loading,
  delay: 300
});

const AsyncGitHubButton = Loadable({
  loader: () => import('../auth/github'),
  loading: Loading,
  delay: 300
});

const loginFormSchema = {
  usernameOrEmail: [required, minLength(3)],
  password: [required, minLength(8)]
};

const validate = values => validateForm(values, loginFormSchema);
const { facebook, linkedin, google, github } = settings.user.auth;

const renderSocialButtons = (buttonsLength, t) => {
  return buttonsLength > 2 ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 200 }}>
      {settings.user.auth.facebook.enabled && (
        <div className="text-center">
          <AsyncFacebookButton text={t('login.fbBtn')} type={'icon'} />
        </div>
      )}
      {settings.user.auth.google.enabled && (
        <div className="text-center">
          <AsyncGoogleButton text={t('login.googleBtn')} type={'icon'} />
        </div>
      )}
      {settings.user.auth.github.enabled && (
        <div className="text-center">
          <AsyncGitHubButton text={t('login.githubBtn')} type={'icon'} />
        </div>
      )}
      {settings.user.auth.linkedin.enabled && (
        <div className="text-center">
          <AsyncLinkedInButton text={t('login.linkedinBtn')} type={'icon'} />
        </div>
      )}
    </div>
  ) : (
    <div>
      {settings.user.auth.facebook.enabled && (
        <div className="text-center">
          <AsyncFacebookButton text={t('login.fbBtn')} type={'button'} />
        </div>
      )}
      {settings.user.auth.google.enabled && (
        <div className="text-center">
          <AsyncGoogleButton text={t('login.googleBtn')} type={'button'} />
        </div>
      )}
      {settings.user.auth.github.enabled && (
        <div className="text-center">
          <AsyncGitHubButton text={t('login.githubBtn')} type={'button'} />
        </div>
      )}
      {settings.user.auth.linkedin.enabled && (
        <div className="text-center">
          <AsyncLinkedInButton text={t('login.linkedinBtn')} type={'button'} />
        </div>
      )}
    </div>
  );
};

const LoginForm = ({ handleSubmit, submitting, error, values, t }) => {
  const buttonsLength = [facebook.enabled, linkedin.enabled, google.enabled, github.enabled].filter(button => button)
    .length;
  return (
    <Form name="login" onSubmit={handleSubmit}>
      <Field
        name="usernameOrEmail"
        component={RenderField}
        type="text"
        label={t('login.form.field.usenameOrEmail')}
        value={values.usernameOrEmail}
      />
      <Field
        name="password"
        component={RenderField}
        type="password"
        label={t('login.form.field.pass')}
        value={values.password}
      />
      <div className="text-center">{error && <Alert color="error">{error}</Alert>}</div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className="text-center">
          <Button size="lg" style={{ minWidth: '320px' }} color="primary" type="submit" disabled={submitting}>
            {t('login.form.btnSubmit')}
          </Button>
        </div>
        {renderSocialButtons(buttonsLength, t)}
      </div>
      <div className="text-center" style={{ marginTop: 10 }}>
        <Link to="/forgot-password">{t('login.btn.forgotPass')}</Link>
      </div>
      <hr />
      <div className="text-center" style={{ marginBottom: 16 }}>
        <span style={{ lineHeight: '58px' }}>{t('login.btn.notReg')}</span>
        <NavLink className="btn btn-primary" to="/register" activeClassName="active" style={{ margin: 10 }}>
          {t('login.btn.sign')}
        </NavLink>
      </div>
    </Form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  values: PropTypes.object,
  t: PropTypes.func
};

const LoginFormWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: () => ({ usernameOrEmail: '', password: '' }),

  handleSubmit(
    values,
    {
      setErrors,
      props: { onSubmit }
    }
  ) {
    onSubmit(values).catch(e => {
      console.log(e);
      setErrors(e);
    });
  },
  validate: values => validate(values),
  displayName: 'LoginForm' // helps with React DevTools
});

export default translate('user')(LoginFormWithFormik(LoginForm));
