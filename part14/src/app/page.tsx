'use client';

import { useState } from 'react';

interface Note {
  id: number;
  content: string;
  important: boolean;
}

const initialNotes: Note[] = [
  { id: 1, content: 'HTML is easy', important: true },
  { id: 2, content: 'Browser can execute only JavaScript', important: false },
  { id: 3, content: 'GET and POST are the most important methods of HTTP protocol', important: true },
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  const addNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newNote.trim()) return;

    const noteObject: Note = {
      id: notes.length + 1,
      content: newNote,
      important: Math.random() < 0.5,
    };

    setNotes(notes.concat(noteObject));
    setNewNote('');
  };

  const toggleImportanceOf = (id: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, important: !note.important } : note
      )
    );
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes App</h1>

      <div className="filter-buttons">
        <button
          className={showAll ? 'active' : ''}
          onClick={() => setShowAll(true)}
        >
          show all
        </button>
        <button
          className={!showAll ? 'active' : ''}
          onClick={() => setShowAll(false)}
        >
          show important
        </button>
      </div>

      <form onSubmit={addNote} className="note-form">
        <div>
          <label htmlFor="note-input">Add a new note:</label>
          <input
            id="note-input"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="a new note..."
          />
        </div>
        <button type="submit" className="btn">
          save
        </button>
      </form>

      <ul className="note-list">
        {notesToShow.map((note) => (
          <li
            key={note.id}
            className={`note-item ${note.important ? 'important' : ''}`}
          >
            <span>{note.content}</span>
            <button
              onClick={() => toggleImportanceOf(note.id)}
              className="btn"
              style={{
                backgroundColor: note.important ? '#dc3545' : '#6c757d',
                fontSize: '0.85rem',
              }}
            >
              make {note.important ? 'not important' : 'important'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
