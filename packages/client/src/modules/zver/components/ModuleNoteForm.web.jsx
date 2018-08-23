import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const noteFormSchema = {
  content: [required]
};

const validate = values => validateForm(values, noteFormSchema);

const ModuleNoteForm = ({ values, handleSubmit, note, t }) => {
  return (
    <Form name="note" onSubmit={handleSubmit}>
      <Row>
        <Col xs={2}>
          <Label>
            {t(`notes.label.${note.id ? 'edit' : 'add'}`)} {t('notes.label.note')}
          </Label>
        </Col>
        <Col xs={8}>
          <Field
            name="content"
            component={RenderField}
            type="text"
            value={values.content}
            placeholder={t('notes.label.field')}
          />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right">
            {t('notes.btn.submit')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

ModuleNoteForm.propTypes = {
  handleSubmit: PropTypes.func,
  note: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  content: PropTypes.string,
  changeContent: PropTypes.func,
  t: PropTypes.func
};

const ModuleNoteFormWithFormik = withFormik({
  mapPropsToValues: props => ({ content: props.note && props.note.content }),
  async handleSubmit(
    values,
    {
      resetForm,
      props: { onSubmit }
    }
  ) {
    await onSubmit(values);
    resetForm({ content: '', updated_at: '', user_id: '' });
  },
  validate: values => validate(values),
  displayName: 'NoteForm', // helps with React DevTools,
  enableReinitialize: true
});

export default translate('zver')(ModuleNoteFormWithFormik(ModuleNoteForm));
