import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/JournalEntry.css';
import { capitalizeFirstLetter } from '../utils/capitalize';

const JournalEntry = ({ user }) => {
  const { date } = useParams();
  const [id, setId] = useState(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/journal/${date}`, { withCredentials: true });
        setId(response.data.id);
        setContent(response.data.content || '');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setContent('');
          setId(null);
        } else {
          console.error('Error fetching journal entry', error);
        }
      }
    };

    fetchEntry();
  }, [date]);

  const handleSave = async () => {
    try {
      const payload = { content };
      const response = await axios.post(`http://localhost:8080/api/journal/${date}`, payload, { withCredentials: true });
      setId(response.data.id);
    } catch (error) {
      console.error('Error saving journal entry', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await axios.delete(`http://localhost:8080/api/journal/${id}`, { withCredentials: true });
        setContent('');
        setId(null);
      }
    } catch (error) {
      console.error('Error deleting journal entry', error);
    }
  };

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="journal-container">
      <div className="header">
        <div className="title">AgendaAlly</div>
        <div className="header-buttons">
          <button onClick={() => navigate('/home')} className="back-button">Back to Calendar</button>
          <button onClick={() => navigate('/')} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="journal-entry-container">
        <h1 className="journal-title">Journal Entry for {formattedDate}</h1>
        <textarea
          className="journal-textarea"
          value={content}
          placeholder="Start writing your journal entry here..."
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="journal-buttons">
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={handleDelete} className="delete-button" disabled={!id}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
