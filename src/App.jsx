import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
import { nanoid } from "nanoid";

function App() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("note")) || []
  );
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  );

  useEffect(() => {
    localStorage.setItem("note", JSON.stringify(notes));
  }, [notes]);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    //Set the new note on top
    setNotes((oldNotes) => {
      let updatedNoteArray = oldNotes.filter(function (oldNote) {
        return oldNote.id === currentNoteId;
      });
      let filteredNoteArray = oldNotes.filter(function (oldNote) {
        return oldNote.id != currentNoteId;
      });
      return [{ ...updatedNoteArray[0], body: text }, ...filteredNoteArray];
    });
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((oldNotes) =>
      oldNotes.filter(function (oldNote) {
        return oldNote.id != noteId;
      })
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            handleDelete={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
