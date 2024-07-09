import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Schedule.css';

const Schedule = ({ user }) => {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ startTime: '', endTime: '', description: '' });
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
        <p className="instruction-text">Add a new task:</p>
        <div className="add-task-form">
          <select
            className="form-control"
            value={newTask.startTime}
            onChange={(e) => handleTaskChange('startTime', e.target.value)}
          >
            <option value="">Start Time</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{formatTime(time)}</option>
            ))}
          </select>
          <select
            className="form-control"
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
            return (
              <div key={time} className="schedule-row">
                {minute === 0 && (
                  <div className="schedule-time" rowSpan={4}>
                    {formatTime(time)}
                  </div>
                )}
                <div className={`schedule-task ${task ? 'task-block' : ''}`}>
                  {task?.task || ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
