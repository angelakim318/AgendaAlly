import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JournalEntry = () => {
  const { date } = useParams();
  const [id, setId] = useState(null); // Add state for ID
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        console.log(`Fetching journal entry for date: ${date}`);
        const response = await axios.get(`http://localhost:8080/api/journal/${date}`, { withCredentials: true });
        setId(response.data.id); // Store the entry ID
        setContent(response.data.content || '');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setContent('');
          setId(null); // Reset ID if no entry found
        } else {
          console.error('Error fetching journal entry', error);
        }
      }
    };

    fetchEntry();
  }, [date]);

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:8080/api/journal/${date}`, { content }, { withCredentials: true });
      console.log('Journal entry saved');
    } catch (error) {
      console.error('Error saving journal entry', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await axios.delete(`http://localhost:8080/api/journal/${id}`, { withCredentials: true });
        setContent(''); // Clear the content on successful delete
        setId(null); // Reset ID
        console.log('Journal entry deleted');
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
    <div>
      <h1>Journal Entry for {formattedDate}</h1>
      <textarea
        value={content}
        placeholder="Start writing your journal entry here..."
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleDelete} disabled={!id}>Delete</button>
      <button onClick={() => navigate('/home')}>Back to Calendar</button>
    </div>
  );
};

export default JournalEntry;
