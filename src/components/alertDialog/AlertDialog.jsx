import Dialog from '@material-ui/core/Dialog';
import React from 'react';
import './AlertDialog.css';
import { GoAlert } from 'react-icons/go';
import { MdClose } from 'react-icons/md';
import { Button } from '@material-ui/core';

function AlertDialog({ handleClose, open, onSuccess }) {
  return (
    <Dialog className='alert-dialog' onClose={handleClose} open={open}>
      <div className='alert-dialog-container'>
        <MdClose onClick={handleClose} />{' '}
      </div>
      <div className='text-alert'>
        <GoAlert className='alert-icon' />
        Are you sure you want to delete this task?
      </div>
      <div className='buttons-design'>
        {approveButton()}
        {cancelButton()}
      </div>
    </Dialog>
  );

  function approveButton() {
    return (
      <Button
        className='button-alert'
        onClick={onSuccess}
        variant='outlined'
        color='secondary'
      >
        Yes
      </Button>
    );
  }

  function cancelButton() {
    return (
      <Button
        className='button-alert'
        onClick={handleClose}
        variant='outlined'
        color='secondary'
      >
        No
      </Button>
    );
  }
}

export default AlertDialog;
