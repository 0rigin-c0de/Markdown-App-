import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import { nanoid } from "nanoid";

import { auth, database } from "./firebase";
import firebase from "./firebase";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const notesRef = database.ref(`notes/${user.uid}`);
        notesRef.on("value", (snapshot) => {
          const notesData = snapshot.val();
          if (notesData) {
            setNotes(Object.values(notesData));
            setCurrentNoteId(Object.values(notesData)[0].id);
          }
        });
      } else {
        setUser(null);
        setNotes([]);
        setCurrentNoteId("");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your title here",
    };
    const notesRef = database.ref(`notes/${user.uid}`);
    notesRef.update({ [newNote.id]: newNote });
    setNotes([...notes, newNote]);
    setCurrentNoteId(newNote.id);
  }




  function updateNote(text) {
    const noteRef = database.ref(`notes/${user.uid}/${currentNoteId}`);
    noteRef.update({ body: text });
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
    const noteRef = database.ref(`notes/${user.uid}/${noteId}`);
    noteRef.remove();
  }

  function handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => { }).catch((error) => { });
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
