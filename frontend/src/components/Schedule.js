import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './styles/Schedule.css';

Modal.setAppElement('#root');

const Schedule = ({ user }) => {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ startTime: '', endTime: '', description: '' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/schedule/${date}`, { withCredentials: true });
      setTasks(response.data.sort((a, b) => (a.startTime > b.startTime ? 1 : -1))); // Sort tasks by startTime
      console.log('Fetched tasks:', response.data);
    } catch (error) {
      console.error('Error fetching schedule tasks', error);
    }
  }, [date]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskChange = (field, value) => {
    setNewTask({ ...newTask, [field]: value });
  };

  const handleAddTask = async () => {
    const newTaskStart = new Date(`1970-01-01T${newTask.startTime}:00`);
    const newTaskEnd = new Date(`1970-01-01T${newTask.endTime}:00`);
  
    const isOverlapping = tasks.some(task => {
      const taskStart = new Date(`1970-01-01T${task.startTime}:00`);
      const taskEnd = new Date(`1970-01-01T${task.endTime}:00`);
      return (newTaskStart < taskEnd && newTaskEnd > taskStart);
    });
  
    if (isOverlapping) {
      setAlertMessage('The task overlaps with an existing task.');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:8080/api/schedule/${date}/${newTask.startTime}/${newTask.endTime}`,
        newTask.description,
        {
          headers: {
            'Content-Type': 'text/plain'
          },
          withCredentials: true
        }
      );
      const addedTask = response.data;
      console.log('Added task:', addedTask);
      await fetchTasks(); // Fetch tasks again after adding
      setNewTask({ startTime: '', endTime: '', description: '' });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setAlertMessage('The task overlaps with an existing task.');
      } else {
        console.error('Error adding schedule task', error);
      }
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/schedule/${selectedTask.id}`,
        { description: selectedTask.task }, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      console.log('Modified task:', response.data);
      await fetchTasks();
      setSelectedTask(null); 
    } catch (error) {
      console.error('Error modifying schedule task', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/schedule/${selectedTask.id}`,
        {
          withCredentials: true
        }
      );
      console.log('Deleted task:', response.data);
      await fetchTasks(); // Fetch tasks again after deleting
      setSelectedTask(null); // Close the modal
    } catch (error) {
      console.error('Error deleting schedule task', error);
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);
    const period = hourInt < 12 ? 'AM' : 'PM';
    const formattedHour = hourInt % 12 === 0 ? 12 : hourInt % 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = String(Math.floor(i / 4)).padStart(2, '0');
    const minute = String((i % 4) * 15).padStart(2, '0');
    return `${hour}:${minute}`;
  });

  return (
    <div className="schedule-container">
      <div className="header">
        <div className="header-title">
          <span>AgendaAlly</span>
          <img src="/icons/notebook.png" alt="Cute Notebook" className="header-icon" />
        </div>
        <div className="header-buttons">
          <button onClick={() => navigate('/home')} className="back-button">Back to Calendar</button>
          <button onClick={() => navigate('/')} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="content">
        <h1 className="schedule-title">Schedule for {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</h1>
        <p className="instruction-text">Add to your schedule:</p>
        <div className="add-task-form">
          <select
            className="form-control time-select"
            value={newTask.startTime}
            onChange={(e) => handleTaskChange('startTime', e.target.value)}
          >
            <option value="">Start Time</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{formatTime(time)}</option>
            ))}
          </select>
          <select
            className="form-control time-select"
            value={newTask.endTime}
            onChange={(e) => handleTaskChange('endTime', e.target.value)}
          >
            <option value="">End Time</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{formatTime(time)}</option>
            ))}
          </select>
          <input
            type="text"
            className="form-control"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => handleTaskChange('description', e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
        </div>
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-item" onClick={() => handleTaskClick(task)}>
              <div className="task-time">{formatTime(task.startTime)} - {formatTime(task.endTime)}</div>
              <div className="task-desc">{task.task}</div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={!!selectedTask}
        onRequestClose={() => setSelectedTask(null)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedTask && (
          <>
            <h2>Task from {formatTime(selectedTask.startTime)} to {formatTime(selectedTask.endTime)}</h2>
            <textarea
              value={selectedTask.task}
              onChange={(e) => setSelectedTask({ ...selectedTask, task: e.target.value })}
            />
            <div className="modal-button-container">
              <button className="modal-btn" onClick={handleSave}>Save</button>
              <button className="modal-btn btn-danger" onClick={handleDelete}>Delete</button>
              <button className="modal-btn" onClick={() => setSelectedTask(null)}>Close</button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        isOpen={!!alertMessage}
        onRequestClose={() => setAlertMessage('')}
        className="custom-alert-modal-content"
        overlayClassName="custom-alert-modal-overlay"
      >
        <div className="custom-alert-modal-body">
          <p>{alertMessage}</p>
          <button onClick={() => setAlertMessage('')} className="btn-primary">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default Schedule;
