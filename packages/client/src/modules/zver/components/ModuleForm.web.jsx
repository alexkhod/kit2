import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, RenderCheckBox, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';
import { IfLoggedIn } from '../../user/containers/AuthBase';

const moduleFormSchema = {
  inv: [required]
};

const validate = values => validateForm(values, moduleFormSchema);

const ModuleForm = ({ values, handleSubmit, submitting, t }) => {
  return (
    <Form name="module" onSubmit={handleSubmit}>
      <IfLoggedIn role="admin">
        <Field name="inv" component={RenderField} type="text" label={t('module.field.title')} value={values.inv} />
      </IfLoggedIn>
      <Field
        name="isWork"
        component={RenderCheckBox}
        type="checkbox"
        label={t('module.field.isWork')}
        checked={values.isWork}
      />
      <IfLoggedIn>
        <Button color="primary" type="submit" disabled={submitting}>
          {t('module.btn.submit')}
        </Button>
      </IfLoggedIn>
    </Form>
  );
};

ModuleForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  module: PropTypes.object,
  t: PropTypes.func,
  zverId: PropTypes.string,
  blockId: PropTypes.string
};

const ModuleFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    inv: props.module && props.module.inv,
    isWork: props.module && props.module.isWork,
    zverId: props.zverId,
    blockId: props.blockId
  }),
  validate: values => validate(values),
  handleSubmit(
    values,
    {
      props: { onSubmit }
    }
  ) {
    onSubmit(values);
  },
  enableReinitialize: true,
  displayName: 'ModuleForm' // helps with React DevTools
});

export default translate('zver')(ModuleFormWithFormik(ModuleForm));
