import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, RenderCheckBox, Row, Col, Label, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const moduleFormSchema = {
  inv: [required]
};

const validate = values => validateForm(values, moduleFormSchema);

const BlockModuleForm = ({ values, handleSubmit, t }) => {
  return (
    <Form name="module" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>
            {t(`modules.label.add`)} {t('modules.label.module')}
          </Label>
        </Col>
        <Col xs={8}>
          <Field
            name="inv"
            component={RenderField}
            type="text"
            value={values.inv}
            placeholder={t('modules.label.field')}
          />
          <Field
            name="isWork"
            component={RenderCheckBox}
            type="checkbox"
            label={t('modules.label.isWork')}
            checked={values.isWork}
          />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right">
            {t('modules.btn.submit')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

BlockModuleForm.propTypes = {
  handleSubmit: PropTypes.func,
  module: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  inv: PropTypes.string,
  changeContent: PropTypes.func,
  t: PropTypes.func
};

const BlockModuleFormWithFormik = withFormik({
  mapPropsToValues: props => ({ inv: props.module && props.module.inv }),
  async handleSubmit(
    values,
    {
      resetForm,
      props: { onSubmit }
    }
  ) {
    await onSubmit(values);
    resetForm({ inv: '' });
  },
  validate: values => validate(values),
  displayName: 'ModuleForm', // helps with React DevTools,
  enableReinitialize: true
});

export default translate('zver')(BlockModuleFormWithFormik(BlockModuleForm));
