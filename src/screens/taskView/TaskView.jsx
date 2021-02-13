import React, { useState, useEffect, useCallback } from 'react';
import Task from '../../components/task/Task';
import TaskDialog from '../../components/taskDialog/TaskDialog';
import {
  serverGetTasks,
  serverDeleteTask,
  serverUpdateTask
} from '../../services/ServerApi';
import { FaPlus } from 'react-icons/fa';
import {
  STATUS_TYPE_INPROGRESS,
  STATUS_TYPE_TODO,
  STATUS_TYPE_DONE
} from '../../helpers/ConstsVar';
import './TaskView.css';
import AlertDialog from '../../components/alertDialog/AlertDialog';
import SearchInput from '../../components/search/SearchInput';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function TaskView() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [deleteItemId, setDeleteItmeId] = useState();
  const [editObject, setEditObject] = useState(null);
  const [todoArray, setTodoArray] = useState([]);
  const [inProgressArray, setInProgressArray] = useState([]);
  const [doneArray, setDoneArray] = useState([]);

  const getTasks = useCallback(() => {
    serverGetTasks()
      .then(res => {
        console.log(res);
        if (res.data && Array.isArray(res.data)) {
          setTasks(res.data);
        }
      })
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <div>
      <h1 className='title-design'>My Tasks</h1>
      <div className='add-search-container'>
        <FaPlus className='icon plus' onClick={handleDialogOpen} />
        <div className='search-input'>
          <SearchInput
            tasks={tasks}
            field={'name'}
            filteredArray={handleFilteredArray}
          />
        </div>
      </div>
      <div className='tasks-container'>
        {renderTaskByColumn()}
        <TaskDialog
          onSuccess={onTaskDialogSuccess}
          open={openDialog}
          editObject={editObject}
          handleClose={handleDialogClose}
        />
        <AlertDialog
          open={openConfirmationDialog}
          handleClose={handleConfirmationDialogClose}
          onSuccess={() => onDelete()}
        />
      </div>
    </div>
  );

  function handleFilteredArray(filteredArray) {
    const todo = [];
    const progress = [];
    const done = [];
    filteredArray.forEach(task => {
      const { status } = task;
      switch (status) {
        case STATUS_TYPE_TODO:
          todo.push(task);
          break;
        case STATUS_TYPE_INPROGRESS:
          progress.push(task);
          break;
        case STATUS_TYPE_DONE:
          done.push(task);
          break;
        default:
          break;
      }
      setTodoArray(todo);
      setInProgressArray(progress);
      setDoneArray(done);
    });
  }

  function handleConfirmationDialogClose() {
    setOpenConfirmationDialog(false);
  }

  function handleDialogOpen() {
    setOpenDialog(true);
  }
  function handleDialogClose() {
    setEditObject(null);
    setOpenDialog(false);
  }

  function onTaskEdit(task, id) {
    setEditObject(task);
    setOpenDialog(true);
    serverUpdateTask(task, id);
  }

  function onTaskDialogSuccess() {
    setEditObject(null);
    getTasks();
    setOpenDialog(false);
  }

  function openAlertDialog(id) {
    setOpenConfirmationDialog(true);
    setDeleteItmeId(id);
  }
  function onDelete() {
    serverDeleteTask(deleteItemId).then(() => {
      getTasks();
      setOpenConfirmationDialog(false);
    });
  }

  function renderTaskByColumn() {
    const columns = [
      { title: 'To Do', type: STATUS_TYPE_TODO, color: 'red', data: todoArray },
      {
        title: 'In Progress',
        type: STATUS_TYPE_INPROGRESS,
        color: 'orange',
        data: inProgressArray
      },
      { title: 'Done', type: STATUS_TYPE_DONE, color: 'green', data: doneArray }
    ];
    return (
      <DragDropContext
        onDragEnd={e => {
          const { detination, source } = e;
          handleOnDragEnd(
            e,
            detination ? detination.droppableId : null,
            source.droppableId
          );
        }}
      >
        {columns.map((col, i) => {
          const { title, color, data, type } = col;
          return (
            <div className='columns-container' key={i}>
              <h1 className='col-title' style={{ color }}>
                {title}
              </h1>

              <Droppable droppableId={type}>
                {provided => (
                  <div
                    className='col-container'
                    id='col-container'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {data.map((task, index) => {
                      const {
                        id,
                        name,
                        description,
                        startDate,
                        endDate,
                        status
                      } = task;
                      return (
                        <Draggable
                          key={id}
                          draggableId={'drag' + id}
                          index={index}
                        >
                          {provided => (
                            <div
                              key={id}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Task
                                description={description}
                                startDate={startDate}
                                endDate={endDate}
                                status={status}
                                onEdit={() => onTaskEdit(task, id)}
                                onDelete={() => openAlertDialog(id)}
                                name={name}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    );
  }

  function handleOnDragEnd(result, type) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      let array = getArrayByType(type);
      let temp = array[source.index];
      array[source.index] = array[destination.index];
      array[destination.index] = temp;
      setArrayByType(type, array);
    } else {
      let task = tasks.find(
        task => task.id === parseInt(result.draggableId.substring(4))
      );
      if (task) {
        task.status = destination.droppableId;
        serverUpdateTask(task, task.id).then(() => getTasks());
      }
    }
  }

  function getArrayByType(type) {
    switch (type) {
      case STATUS_TYPE_DONE:
        return doneArray;
      case STATUS_TYPE_INPROGRESS:
        return inProgressArray;
      case STATUS_TYPE_TODO:
        return todoArray;
      default:
        return [];
    }
  }

  function setArrayByType(type, array) {
    switch (type) {
      case STATUS_TYPE_DONE:
        setDoneArray(array);
        break;
      case STATUS_TYPE_INPROGRESS:
        setInProgressArray(array);
        break;
      case STATUS_TYPE_TODO:
        setTodoArray(array);
        break;
      default:
        break;
    }
  }
}

export default TaskView;
