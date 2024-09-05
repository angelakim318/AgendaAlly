import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
} from '@draft-js-plugins/buttons';
import './styles/JournalEntry.css';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

const myKeyBindingFn = (e) => {
  return getDefaultKeyBinding(e);
};

const handleKeyCommand = (command, editorState, setEditorState) => {
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    setEditorState(newState);
    return 'handled';
  }
  return 'not-handled';
};

const JournalEntry = ({ user }) => {
  const { date } = useParams();
  const [id, setId] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [isEditing, setIsEditing] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [originalContent, setOriginalContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`http://backend:8080/api/journal/${date}`, { withCredentials: true }); // Change localhost to backend when deploying using ec2
        if (response.data.content) {
          const contentState = stateFromHTML(response.data.content);
          setEditorState(EditorState.createWithContent(contentState));
          setOriginalContent(response.data.content);
        } else {
          setEditorState(EditorState.createEmpty());
          setOriginalContent('');
        }
        setId(response.data.id);
        setIsSaveDisabled(true);
        setIsEditing(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEditorState(EditorState.createEmpty());
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

  const handleEditorChange = (state) => {
    setEditorState(state);
    const currentContent = stateToHTML(state.getCurrentContent()).trim();
    setIsSaveDisabled(currentContent === '' || currentContent === originalContent);
  };

  const handleSave = async () => {
    try {
      const currentContent = stateToHTML(editorState.getCurrentContent()).trim();
      const payload = { content: currentContent };
      const response = await axios.post(`http://backend:8080/api/journal/${date}`, payload, { withCredentials: true }); // Change localhost to backend when deploying using ec2
      setId(response.data.id);
      setOriginalContent(currentContent);
      setIsSaveDisabled(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving journal entry', error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await axios.delete(`http://backend:8080/api/journal/${id}`, { withCredentials: true }); // Change localhost to backend when deploying using ec2
        setEditorState(EditorState.createEmpty());
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
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="journal-container">
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
      <div className="journal-entry-container">
        <h1 className="journal-title">Journal Entry for {formattedDate}</h1>
        {!isEditing && (
          <div className="journal-content">
            {originalContent ? (
              <div dangerouslySetInnerHTML={{ __html: originalContent }} />
            ) : (
              <p className="journal-placeholder">Click on Add/Modify to add a journal entry.</p>
            )}
          </div>
        )}
        {isEditing && (
          <div className="editor-wrapper">
            <Toolbar>
              {(externalProps) => (
                <>
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <Separator {...externalProps} />
                  <HeadlineOneButton {...externalProps} />
                  <HeadlineTwoButton {...externalProps} />
                  <HeadlineThreeButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                </>
              )}
            </Toolbar>
            <div className="editor-container">
              <Editor
                editorState={editorState}
                onChange={handleEditorChange}
                plugins={plugins}
                className="journal-textarea"
                keyBindingFn={myKeyBindingFn}
                handleKeyCommand={(command) => handleKeyCommand(command, editorState, setEditorState)}
              />
            </div>
          </div>
        )}
        <div className="journal-buttons">
          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="edit-button">Add/Modify</button>
              <button onClick={handleDelete} className="delete-button" disabled={!id || originalContent.trim() === ''}>Delete</button>
            </>
          )}
          {isEditing && (
            <>
              <button onClick={handleSave} className="save-button" disabled={isSaveDisabled}>Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
