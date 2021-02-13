import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import './TaskDialog.css';
import { MdClose } from 'react-icons/md';

import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@material-ui/core';
import {
  STATUS_TYPE_TODO,
  STATUS_TYPE_DONE,
  STATUS_TYPE_INPROGRESS
} from '../../helpers/ConstsVar';
import { serverCreateTask } from '../../services/ServerApi';

function TaskDialog({ handleClose, open, editObject, onSuccess }) {
  const [state, setState] = useState({});
  useEffect(() => {
    if (editObject) {
      setState(editObject);
    } else {
      setState({});
    }
  }, [editObject]);

  return (
    <Dialog
      className='dialog-container'
      onClose={handleClose}
      aria-labelledby='customized-dialog-title'
      open={open}
    >
      <MdClose onClick={handleClose} />
      <form onSubmit={handleSubmit}>
        {renderTitle()}
        {renderNameInput()}
        {renderDatesInput()}
        {renderDescriptionInput()}
        {renderStatusInput()}

        <input type='submit' className='button-alert' value='Submit' />
      </form>
    </Dialog>
  );

  function renderNameInput() {
    return (
      <TextField
        label='Task Name'
        value={state.name || ''}
        onChange={event => handleChange('name', event)}
        required
      />
    );
  }

  function renderTitle() {
    const title = editObject ? 'Edit Task' : 'Add a new Task';
    return <h3 className='title'>{title}</h3>;
  }
  function renderDescriptionInput() {
    return (
      <div className='description-input'>
        <TextField
          multiline
          value={state.description || ''}
          onChange={event => handleChange('description', event)}
          label='Decsription'
          required
        />
      </div>
    );
  }

  function renderStatusInput(status) {
    const statusArray = [
      { title: 'progress', value: STATUS_TYPE_INPROGRESS },
      { title: 'done', value: STATUS_TYPE_DONE },
      { title: 'todo', value: STATUS_TYPE_TODO }
    ];
    //dropdown
    return (
      <div className='status-input'>
        <FormControl>
          <InputLabel htmlFor='grouped-select'>Status</InputLabel>
          <Select
            className='select-drop-down'
            defaultValue={STATUS_TYPE_TODO}
            id='grouped-select'
            onChange={event => handleChange('status', event)}
            value={state.status || ''}
            required
          >
            {statusArray.map((status, index) => {
              const { value } = status;
              return (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>
    );
  }
  function renderDatesInput() {
    return (
      <div className='dates-inputs-container'>
        <TextField
          id='date'
          label='Start date'
          type='date'
          required
          onChange={event => handleChange('startDate', event)}
          value={state.startDate}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id='date'
          label='End date'
          type='date'
          onChange={event => handleChange('endDate', event)}
          value={state.endDate || ''}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    serverCreateTask(state)
      .then(res => onSuccess())
      .catch(e => console.error(e));
  }

  function handleChange(stateName, event) {
    const { value } = event.target;
    console.log({ ...state, [stateName]: value });
    setState({ ...state, [stateName]: value });
  }
}

export default TaskDialog;
