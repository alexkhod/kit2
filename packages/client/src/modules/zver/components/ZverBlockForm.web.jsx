import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, RenderCheckBox, Row, Col, Label, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const blockFormSchema = {
  inv: [required]
};

const validate = values => validateForm(values, blockFormSchema);

const ZverBlockForm = ({ values, handleSubmit, t }) => {
  return (
    <Form name="block" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>
            {t(`blocks.label.add`)} {t('blocks.label.block')}
          </Label>
        </Col>
        <Col xs={8}>
          <Field
            name="inv"
            component={RenderField}
            type="text"
            value={values.inv}
            placeholder={t('blocks.label.field')}
          />
          <Field
            name="isWork"
            component={RenderCheckBox}
            type="checkbox"
            label={t('blocks.label.isWork')}
            checked={values.isWork}
          />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right">
            {t('blocks.btn.submit')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

ZverBlockForm.propTypes = {
  handleSubmit: PropTypes.func,
  block: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  inv: PropTypes.string,
  changeContent: PropTypes.func,
  t: PropTypes.func
};

const ZverBlockFormWithFormik = withFormik({
  mapPropsToValues: props => ({ inv: props.block && props.block.inv }),
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
  displayName: 'BlockForm', // helps with React DevTools,
  enableReinitialize: true
});

export default translate('zver')(ZverBlockFormWithFormik(ZverBlockForm));
