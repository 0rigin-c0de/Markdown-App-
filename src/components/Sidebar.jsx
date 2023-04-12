import React from "react";
import { auth } from "../firebase";

export default function Sidebar(props) {
  const noteElements = props.notes.map((note) => {
    return (
      <div key={note.id}>
        <div
          className={`title ${note.id === props.currentNote?.id ? "selected-note" : ""}`}
          onClick={() => props.setCurrentNoteId(note.id)}
        >
          <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
          <button
            className="delete-btn"
            onClick={(event) => props.handleDelete(event, note.id)}
          >
            <i className="gg-trash trash-icon"></i>
          </button>
        </div>
      </div>
    );
  });

  function handleSignOut() {
    auth.signOut();
  }

  return (
    <section className="pane sidebar">
      <div className="sidebar--header">
        <h2 className="sidebar-tittle">Notes</h2>
        <button className="new-note" onClick={props.newNote}>
          New
        </button>
        <div className="user-info">
          <img src={auth.currentUser?.photoURL} alt={auth.currentUser?.displayName} className="user-avatar" />
          <button className="logout" onClick={handleSignOut}>
            Logout
          </button>
        </div>
      </div>
      {noteElements}
    </section>
  );
}
