import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Schedule.css';
import { capitalizeFirstLetter } from '../utils/capitalize';

const Schedule = ({ user }) => {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({ id: null, content: '', time: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/schedule/${date}`, { withCredentials: true });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching schedule tasks', error);
      }
    };

    fetchTasks();
  }, [date]);

  const handleTaskChange = (time, content) => {
    setSelectedTask({ ...selectedTask, time, content });
  };

  const handleSave = async () => {
    try {
      const payload = { task: selectedTask.content };
      await axios.post(`http://localhost:8080/api/schedule/${date}/${selectedTask.time}`, payload, { withCredentials: true });
      setTasks(tasks.map(task => (task.time === selectedTask.time ? { ...task, task: selectedTask.content } : task)));
      setSelectedTask({ id: null, content: '', time: '' });
    } catch (error) {
      console.error('Error saving schedule task', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedTask.id) {
        await axios.delete(`http://localhost:8080/api/schedule/${selectedTask.id}`, { withCredentials: true });
        setTasks(tasks.filter(task => task.id !== selectedTask.id));
        setSelectedTask({ id: null, content: '', time: '' });
      }
    } catch (error) {
      console.error('Error deleting schedule task', error);
    }
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="schedule-container">
      <div className="header">
        <div className="title">AgendaAlly</div>
        <div className="welcome-message">Welcome, {user ? user.firstName : ''}!</div>
        <button onClick={() => navigate('/')} className="logout-button">Logout</button>
      </div>
      <h1 className="schedule-title">Schedule for {formattedDate}</h1>
      <div className="schedule-grid">
        {[...Array(24).keys()].map(hour => (
          <div key={hour} className="schedule-row">
            <div className="schedule-time">{`${hour.toString().padStart(2, '0')}:00`}</div>
            <div
              className="schedule-task"
              onClick={() => setSelectedTask({
                id: tasks.find(task => task.time === `${hour.toString().padStart(2, '0')}:00`)?.id || null,
                time: `${hour.toString().padStart(2, '0')}:00`,
                content: tasks.find(task => task.time === `${hour.toString().padStart(2, '0')}:00`)?.task || ''
              })}
            >
              {tasks.find(task => task.time === `${hour.toString().padStart(2, '0')}:00`)?.task || ''}
            </div>
          </div>
        ))}
      </div>
      {selectedTask.time && (
        <div className="task-modal">
          <textarea
            value={selectedTask.content}
            onChange={(e) => handleTaskChange(selectedTask.time, e.target.value)}
          />
          <div className="modal-buttons">
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={handleDelete} className="delete-button" disabled={!selectedTask.id}>Delete</button>
          </div>
        </div>
      )}
      <button onClick={() => navigate('/home')} className="back-button">Back to Calendar</button>
    </div>
  );
};

export default Schedule;
