import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button, RenderCheckBox } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';
import { IfLoggedIn } from '../../user/containers/AuthBase';

const blockFormSchema = {
  inv: [required]
};

const validate = values => validateForm(values, blockFormSchema);

const BlockForm = ({ values, handleSubmit, submitting, t }) => {
  return (
    <Form name="block" onSubmit={handleSubmit}>
      <IfLoggedIn role="admin">
        <Field name="inv" component={RenderField} type="text" label={t('block.field.title')} value={values.inv} />
      </IfLoggedIn>
      <Field
        name="isWork"
        component={RenderCheckBox}
        type="checkbox"
        label={t('block.field.isWork')}
        checked={values.isWork}
      />
      <IfLoggedIn>
        <Button color="primary" type="submit" disabled={submitting}>
          {t('block.btn.submit')}
        </Button>
      </IfLoggedIn>
    </Form>
  );
};

BlockForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  block: PropTypes.object,
  t: PropTypes.func,
  zverId: PropTypes.string
};

const BlockFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    inv: props.block && props.block.inv,
    isWork: props.block && props.block.isWork,
    zverId: props.zverId
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
  displayName: 'BlockForm' // helps with React DevTools
});

export default translate('zver')(BlockFormWithFormik(BlockForm));
