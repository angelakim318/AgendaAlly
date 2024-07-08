import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Schedule.css';

const Schedule = ({ user }) => {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);
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

  const handleTaskChange = (field, value) => {
    setSelectedTask({ ...selectedTask, [field]: value });
    const { startTime, endTime, content } = selectedTask;
    setIsSaveDisabled(
      content.trim() === '' ||
      startTime.trim() === '' ||
      endTime.trim() === '' ||
      new Date(`1970-01-01T${endTime}`) <= new Date(`1970-01-01T${startTime}`)
    );
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
    const [hour, minute] = time.split(':'); // Removed second
    const hourInt = parseInt(hour, 10);
    const period = hourInt < 12 ? 'AM' : 'PM';
    const formattedHour = hourInt % 12 === 0 ? 12 : hourInt % 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const calculateGridRowSpan = (startTime, endTime) => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    return endHour - startHour;
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
        <h1 className="schedule-title">Schedule for {formattedDate}</h1>
        <p className="instruction-text">Click next to a time to add a task. You can add, modify, or remove a task anytime.</p>
        <div className="schedule-grid">
          {[...Array(24).keys()].map(hour => {
            const task = tasks.find(t => {
              const taskStartHour = parseInt(t.startTime.split(':')[0], 10);
              const taskEndHour = parseInt(t.endTime.split(':')[0], 10);
              return taskStartHour <= hour && hour < taskEndHour;
            });
            return (
              <div key={hour} className="schedule-row">
                <div className="schedule-time">{formatTime(`${hour.toString().padStart(2, '0')}:00:00`)}</div>
                {task && task.startTime.split(':')[0] === hour.toString().padStart(2, '0') ? (
                  <div
                    className="schedule-task task-block"
                    onClick={() => {
                      setSelectedTask({
                        id: task?.id || null,
                        startTime: task?.startTime || `${hour.toString().padStart(2, '0')}:00:00`,
                        endTime: task?.endTime || `${hour.toString().padStart(2, '0')}:00:00`,
                        content: task?.task || ''
                      });
                      setIsSaveDisabled(task ? task.task.trim() === '' : true);
                      setIsDeleteDisabled(!task || !task.id);
                    }}
                    style={task ? { gridRow: `span ${calculateGridRowSpan(task.startTime, task.endTime)}` } : {}}
                  >
                    {task?.task || ''}
                  </div>
                ) : (
                  <div className="schedule-task" />
                )}
              </div>
            );
          })}
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
