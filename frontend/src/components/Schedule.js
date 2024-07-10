import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './styles/Schedule.css';

Modal.setAppElement('#root'); // Ensure that the modal is correctly registered

const Schedule = ({ user }) => {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ startTime: '', endTime: '', description: '' });
  const [selectedTask, setSelectedTask] = useState(null);
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

  const handleTaskChange = (field, value) => {
    setNewTask({ ...newTask, [field]: value });
  };

  const handleAddTask = async () => {
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
      console.error('Error adding schedule task', error);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/schedule/${selectedTask.id}`,
        { task: selectedTask.task },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      console.log('Modified task:', response.data);
      await fetchTasks(); // Fetch tasks again after modifying
      setSelectedTask(null); // Close the modal
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

  const calculateRowSpan = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    return Math.ceil((endTotalMinutes - startTotalMinutes) / 15);
  };

  const getGridRowStart = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    return hour * 4 + Math.floor(minute / 15) + 1;
  };

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
        <p className="instruction-text">Add a new task:</p>
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
        <div className="schedule-grid">
          {[...Array(96).keys()].map(i => {
            const hour = Math.floor(i / 4);
            const minute = (i % 4) * 15;
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const task = tasks.find(t => t.startTime <= time && time < t.endTime);
            if (task) {
              const rowSpan = calculateRowSpan(task.startTime, task.endTime);
              const gridRowStart = getGridRowStart(task.startTime);
              return (
                <div key={`${task.id}-${i}`} className="task-block" style={{ gridRow: `${gridRowStart} / span ${rowSpan}` }} onClick={() => handleTaskClick(task)}>
                  <div className="schedule-task">
                    {task.task}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={time} className="schedule-row">
                  {minute === 0 && (
                    <div className="schedule-time">
                      {formatTime(time)}
                    </div>
                  )}
                  <div className="schedule-task"></div>
                </div>
              );
            }
          })}
        </div>
      </div>
      {selectedTask && (
        <Modal
          isOpen={!!selectedTask}
          onRequestClose={() => setSelectedTask(null)}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
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
        </Modal>
      )}
    </div>
  );
};

export default Schedule;
