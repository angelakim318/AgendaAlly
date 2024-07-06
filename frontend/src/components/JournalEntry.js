import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/JournalEntry.css';

const JournalEntry = ({ user }) => {
  const { date } = useParams();
  const [id, setId] = useState(null);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [originalContent, setOriginalContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/journal/${date}`, { withCredentials: true });
        setId(response.data.id);
        setContent(response.data.content || '');
        setOriginalContent(response.data.content || '');
        setIsSaveDisabled(true);
        setIsEditing(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setContent('');
          setId(null);
          setOriginalContent('');
          setIsSaveDisabled(true);
          setIsEditing(false);
        } else {
          console.error('Error fetching journal entry', error);
        }
      }
    };

    fetchEntry();
  }, [date]);

  const handleContentChange = (value) => {
    setContent(value);
    setIsSaveDisabled(value.trim() === '' || value === originalContent);
  };

  const cleanContent = (content) => {
    // Remove empty paragraphs
    return content.replace(/<p><br><\/p>/g, '');
  };

  const handleSave = async () => {
    try {
      const cleanedContent = cleanContent(content);
      const payload = { content: cleanedContent };
      const response = await axios.post(`http://localhost:8080/api/journal/${date}`, payload, { withCredentials: true });
      setId(response.data.id);
      setOriginalContent(cleanedContent);
      setIsSaveDisabled(true);
      setIsEditing(false);
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
        setOriginalContent('');
        setIsSaveDisabled(true);
        setIsEditing(false);
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
        <div className="header-title">AgendaAlly</div>
        <div className="header-buttons">
          <button onClick={() => navigate('/home')} className="back-button">Back to Calendar</button>
          <button onClick={() => navigate('/')} className="logout-button">Logout</button>
        </div>
      </div>
      <div className="journal-entry-container">
        <h1 className="journal-title">Journal Entry for {formattedDate}</h1>
        {!isEditing && (
          <div className="journal-content">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="journal-placeholder">Add a journal entry for today</p>
            )}
          </div>
        )}
        {isEditing && (
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing your journal entry here..."
            className="journal-textarea"
          />
        )}
        <div className="journal-buttons">
          {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-button">Add/Modify</button>}
          {isEditing && <button onClick={handleSave} className="save-button" disabled={isSaveDisabled}>Save</button>}
          <button onClick={handleDelete} className="delete-button" disabled={!id}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
