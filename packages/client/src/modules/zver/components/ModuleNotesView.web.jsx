import React from 'react';
import PropTypes from 'prop-types';

import translate from '../../../i18n';
import { Table, Button } from '../../common/components/web';
import ModuleNoteForm from './ModuleNoteForm';
import { IfLoggedIn, IfNotLoggedIn } from '../../user/containers/AuthBase';

class ModuleNotesView extends React.PureComponent {
  static propTypes = {
    moduleId: PropTypes.number.isRequired,
    notes: PropTypes.array.isRequired,
    note: PropTypes.object,
    addNote: PropTypes.func.isRequired,
    editNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    onNoteSelect: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  handleEditNote = (id, content, updated_at, user_id) => {
    const { onNoteSelect } = this.props;
    onNoteSelect({ id, content, updated_at, user_id });
  };

  handleDeleteNote = id => {
    const { note, onNoteSelect, deleteNote } = this.props;

    if (note.id === id) {
      onNoteSelect({ id: null, content: '', updated_at: '', user_id: '' });
    }

    deleteNote(id);
  };

  onSubmit = () => values => {
    const { note, moduleId, addNote, editNote, onNoteSelect } = this.props;

    if (note.id === null) {
      addNote(values.content, moduleId);
    } else {
      editNote(note.id, values.content, values.updated_at, values.user_id);
    }

    onNoteSelect({ id: null, content: '', updated_at: '', user_id: '' });
  };

  render() {
    const { moduleId, notes, note, t } = this.props;
    const columnsForLoggedIn = [
      {
        title: t('notes.column.user'),
        dataIndex: 'user_id',
        key: 'user_id'
      },
      {
        title: t('notes.column.updated'),
        dataIndex: 'updated_at',
        key: 'updated_at'
      },
      {
        title: t('notes.column.content'),
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: t('notes.column.actions'),
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <IfLoggedIn role="admin">
            <div style={{ width: 120 }}>
              <Button
                color="primary"
                size="sm"
                className="edit-note"
                onClick={() => this.handleEditNote(record.id, record.content, record.updated_at, record.user_id)}
              >
                {t('notes.btn.edit')}
              </Button>{' '}
              <Button
                color="primary"
                size="sm"
                className="delete-note"
                onClick={() => this.handleDeleteNote(record.id)}
              >
                {t('notes.btn.del')}
              </Button>
            </div>
          </IfLoggedIn>
        )
      }
    ];

    const columnsForNotLoggedIn = [
      {
        title: t('notes.column.user'),
        dataIndex: 'user_id',
        key: 'user_id'
      },
      {
        title: t('notes.column.updated'),
        dataIndex: 'updated_at',
        key: 'updated_at'
      },
      {
        title: t('notes.column.content'),
        dataIndex: 'content',
        key: 'content'
      }
    ];

    return (
      <div>
        <h3>{t('notes.title')}</h3>
        <IfLoggedIn>
          <ModuleNoteForm moduleId={moduleId} onSubmit={this.onSubmit()} initialValues={note} note={note} />
        </IfLoggedIn>
        <h1 />
        <IfLoggedIn>
          <Table dataSource={notes} columns={columnsForLoggedIn} />
        </IfLoggedIn>
        <IfNotLoggedIn>
          <Table dataSource={notes} columns={columnsForNotLoggedIn} />
        </IfNotLoggedIn>
      </div>
    );
  }
}

export default translate('zver')(ModuleNotesView);
