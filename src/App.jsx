import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";
import { auth } from "./firebase";
import firebase from "./firebase";
import "./index.css";

function App() {
  const [notes, setNotes] = useState(
    () => JSON.parse(localStorage.getItem("note")) || []
  );
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ""
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("note", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your tittle here",
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

  function handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => { })
      .catch((error) => { });
  }

  function handleSignOut() {
    auth.signOut();
  }

  return (
    <main>
      {user ? (
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
          <button className="logout" onClick={handleSignOut}>
            Logout
          </button>
        </Split>
      ) : (
        <div className="no-notes">
          <h1 className="app-title">Notes App</h1>
          <button className="google-login" onClick={handleSignIn}>
            Sign in with Google
          </button>
        </div>
      )}
    </main>
  );

}

export default App;
