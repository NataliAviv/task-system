import React from 'react';
import './Task.css';
import { dateToString } from '../../helpers/DateHelper';
import { MdDelete, MdModeEdit } from 'react-icons/md';

function Task({
  name = 'cock',
  description = 'cock pizza',
  status = 'in progress',
  startDate = new Date(),
  endDate = '12/20/2020',
  onEdit,
  onDelete,
  onResize
}) {
  return (
    <div className='task-container'>
      {renderName()}
      {renderDates()}
      <div className='description-status-buttons-container'>
        {renderDescription()}
        <div className='status-buttons-container'>
          <div>{renderStatus()}</div>
          {renderButtons()}
        </div>
      </div>
    </div>
  );

  function renderName() {
    return (
      <div className='task-name'>
        <p>{name}</p>
      </div>
    );
  }

  function renderDescription() {
    return <div className='task-description'>Description: {description}</div>;
  }

  function renderStatus() {
    return <div className='task-status'>{status}</div>;
  }

  function renderDates() {
    return (
      <div className='task-date-container'>
        <div className='start-date'>start: {dateToString(startDate)}</div>
        <div className='end-date'>end: {endDate && dateToString(endDate)}</div>
      </div>
    );
  }

  function renderButtons() {
    return (
      <div className='buttons-container'>
        <MdModeEdit className='icon-button' onClick={onEdit} />
        <MdDelete className='icon-button' onClick={onDelete} />
      </div>
    );
  }
}

export default Task;
