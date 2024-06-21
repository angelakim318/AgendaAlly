import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Schedule.css';

const Schedule = ({ user }) => {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState({ id: null, content: '', time: '' });
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

  const handleTaskChange = (time, content) => {
    setSelectedTask({ ...selectedTask, time, content });
    setIsSaveDisabled(content.trim() === '');
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/schedule/${date}/${selectedTask.time}`, selectedTask.content, {
        headers: {
          'Content-Type': 'text/plain'
        },
        withCredentials: true
      });
      const updatedTask = response.data;
      console.log('Saved task:', updatedTask);
      await fetchTasks(); // Fetch tasks again after saving
      setSelectedTask({ id: null, content: '', time: '' });
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
        setSelectedTask({ id: null, content: '', time: '' });
        setIsSaveDisabled(true);
        setIsDeleteDisabled(true);
      }
    } catch (error) {
      console.error('Error deleting schedule task', error);
    }
  };

  const handleClose = () => {
    setSelectedTask({ id: null, content: '', time: '' });
    setIsSaveDisabled(true);
    setIsDeleteDisabled(true);
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const formatTime = (hour) => {
    const period = hour < 12 ? 'AM' : 'PM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${period}`;
  };

  return (
    <div className="schedule-container">
      <div className="header">
        <div className="header-title">AgendaAlly</div>
        <div className="header-buttons">
          <button onClick={() => navigate('/home')} className="back-button">Back to Calendar</button>
          <button onClick={() => navigate('/')} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="content">
        <h1 className="schedule-title">Schedule for {formattedDate}</h1>
        <div className="schedule-grid">
          {[...Array(24).keys()].map(hour => {
            const task = tasks.find(task => task.time === `${hour.toString().padStart(2, '0')}:00:00`);
            return (
              <div key={hour} className="schedule-row">
                <div className="schedule-time">{formatTime(hour)}</div>
                <div
                  className="schedule-task"
                  onClick={() => {
                    setSelectedTask({
                      id: task?.id || null,
                      time: `${hour.toString().padStart(2, '0')}:00:00`,
                      content: task?.task || ''
                    });
                    setIsSaveDisabled(task ? task.task.trim() === '' : true);
                    setIsDeleteDisabled(!task || !task.id);
                  }}
                >
                  {task?.task || ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selectedTask.time && (
        <div className="task-modal">
          <textarea
            value={selectedTask.content}
            onChange={(e) => handleTaskChange(selectedTask.time, e.target.value)}
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
