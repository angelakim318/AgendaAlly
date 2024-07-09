import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Schedule.css';

const Schedule = ({ user }) => {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ content: '', startTime: '', endTime: '' });
  const [selectedTask, setSelectedTask] = useState({ id: null, content: '', startTime: '', endTime: '' });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/schedule/${date}`, { withCredentials: true });
      setTasks(response.data);
      console.log('Fetched tasks:', response.data);
    } catch (error) {
      console.error('Error fetching schedule tasks', error);
    }
  }, [date]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const handleTaskChange = (field, value) => {
    if (selectedTask.id) {
      setSelectedTask({ ...selectedTask, [field]: value });
    } else {
      setNewTask({ ...newTask, [field]: value });
    }
    const { startTime, endTime, content } = selectedTask.id ? selectedTask : newTask;
    setIsSaveDisabled(
      content.trim() === '' ||
      startTime.trim() === '' ||
      endTime.trim() === '' ||
      new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)
    );
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/schedule/${date}/${newTask.startTime}/${newTask.endTime}`,
        newTask.content,
        {
          headers: {
            'Content-Type': 'text/plain'
          },
          withCredentials: true
        }
      );
      const updatedTask = response.data;
      console.log('Added task:', updatedTask);
      await fetchTasks(); // Fetch tasks again after saving
      setNewTask({ content: '', startTime: '', endTime: '' });
      setIsSaveDisabled(true);
    } catch (error) {
      console.error('Error adding schedule task', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/schedule/${date}/${selectedTask.startTime}/${selectedTask.endTime}`,
        selectedTask.content,
        {
          headers: {
            'Content-Type': 'text/plain'
          },
          withCredentials: true
        }
      );
      const updatedTask = response.data;
      console.log('Saved task:', updatedTask);
      await fetchTasks(); // Fetch tasks again after saving
      setSelectedTask({ id: null, content: '', startTime: '', endTime: '' });
      setIsSaveDisabled(true);
      setIsDeleteDisabled(true);
    } catch (error) {
      console.error('Error saving schedule task', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedTask.id) {
        await axios.delete(`http://localhost:8080/api/schedule/${selectedTask.id}`, { withCredentials: true });
        await fetchTasks(); // Fetch tasks again after deleting
        setSelectedTask({ id: null, content: '', startTime: '', endTime: '' });
        setIsSaveDisabled(true);
        setIsDeleteDisabled(true);
      }
    } catch (error) {
      console.error('Error deleting schedule task', error);
    }
  };

  const handleClose = () => {
    setSelectedTask({ id: null, content: '', startTime: '', endTime: '' });
    setIsSaveDisabled(true);
    setIsDeleteDisabled(true);
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', // Use 'long' to get the full month name
    day: 'numeric'
  });

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);
    const period = hourInt < 12 ? 'AM' : 'PM';
    const formattedHour = hourInt % 12 === 0 ? 12 : hourInt % 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const calculateGridRowSpan = (startTime, endTime) => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const startMinutes = parseInt(startTime.split(':')[1], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    const endMinutes = parseInt(endTime.split(':')[1], 10);
    return (endHour * 60 + endMinutes - startHour * 60 - startMinutes) / 15;
  };

  const calculateTopOffset = (startTime) => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const startMinutes = parseInt(startTime.split(':')[1], 10);
    return (startHour * 60 + startMinutes) / 15 * 20; // Each 15 minutes is 20px tall
  };

  const timeOptions = generateTimeOptions();

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
        <h1 className="schedule-title">Schedule for {formattedDate}</h1>
        <p className="instruction-text">Add a new task:</p>
        <div className="row mb-3">
          <div className="col-3">
            <select
              value={newTask.startTime}
              onChange={(e) => handleTaskChange('startTime', e.target.value)}
              className="form-control"
            >
              <option value="">Start Time</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className="col-3">
            <select
              value={newTask.endTime}
              onChange={(e) => handleTaskChange('endTime', e.target.value)}
              className="form-control"
            >
              <option value="">End Time</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <input
              type="text"
              value={newTask.content}
              onChange={(e) => handleTaskChange('content', e.target.value)}
              className="form-control"
              placeholder="Task Description"
            />
          </div>
          <div className="col-2">
            <button onClick={handleAddTask} className="btn btn-primary" disabled={isSaveDisabled}>Add Task</button>
          </div>
        </div>
        <div className="schedule-grid">
          <div className="schedule-times">
            {[...Array(24).keys()].map(hour => (
              <div key={hour} className="schedule-time">
                {formatTime(`${hour.toString().padStart(2, '0')}:00:00`)}
                {[...Array(3).keys()].map(index => (
                  <div key={index} className="time-divider"></div>
                ))}
              </div>
            ))}
          </div>
          <div className="schedule-tasks">
            {[...Array(24 * 4).keys()].map(index => (
              <div key={index} className="schedule-task-container">
                <div className="schedule-task" />
              </div>
            ))}
            {tasks.map(task => (
              <div
                key={task.id}
                className="task-block"
                style={{
                  height: `${calculateGridRowSpan(task.startTime, task.endTime) * 20}px`,
                  top: `${calculateTopOffset(task.startTime)}px`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask({
                    id: task.id,
                    startTime: task.startTime,
                    endTime: task.endTime,
                    content: task.task
                  });
                  setIsSaveDisabled(false);
                  setIsDeleteDisabled(false);
                }}
              >
                {task.task}
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedTask.startTime && (
        <div className="task-modal">
          <h2 className="task-modal-title">{`Task from ${formatTime(selectedTask.startTime)} to ${formatTime(selectedTask.endTime)}`}</h2>
          <div className="time-inputs">
            <label>
              Start Time:
              <input
                type="time"
                value={selectedTask.startTime}
                onChange={(e) => handleTaskChange('startTime', e.target.value)}
                className="time-input"
              />
            </label>
            <label>
              End Time:
              <input
                type="time"
                value={selectedTask.endTime}
                onChange={(e) => handleTaskChange('endTime', e.target.value)}
                className="time-input"
              />
            </label>
          </div>
          <textarea
            value={selectedTask.content}
            onChange={(e) => handleTaskChange('content', e.target.value)}
            className="task-textarea"
          />
          <div className="modal-buttons">
            <button onClick={handleSave} className="save-button" disabled={isSaveDisabled}>Save</button>
            <button onClick={handleDelete} className="delete-button" disabled={isDeleteDisabled}>Delete</button>
            <button onClick={handleClose} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
