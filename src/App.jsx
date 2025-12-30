import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import bin from "./bin.png";
import edit from "./edit.png";

function App() {
  const [todos, setTodos] = useState([]);
  const [newtodo, setNewtodo] = useState("");
  const [oldtodo, setOldtodo] = useState("");
  const [editmode, setEditmode] = useState(false);
  const [error, setError] = useState(""); // to show errors

  // Make sure this URL does NOT end with a slash
  const Base_Url = import.meta.env.VITE_BASE_URL; 
  // Example: "https://server-todo-application.onrender.com"

  // Load todos from server
  const loadTodos = async () => {
    try {
      setError(""); // clear previous error
      console.log("Loading todos...");
      const response = await axios.get(`${Base_Url}/todos`); // change /todos if backend uses /api/todos
      setTodos(response.data.data);
    } catch (err) {
      console.error("Error loading todos:", err);
      setError("Failed to load todos. Check backend URL and server status.");
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!newtodo.trim()) return; // prevent empty todos
    try {
      setError("");
      await axios.post(`${Base_Url}/todos`, { todoItem: newtodo });
      setNewtodo("");
      loadTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo. Check backend.");
    }
  };

  // Edit existing todo
  const editTodo = async () => {
    if (!newtodo.trim()) return;
    try {
      setError("");
      await axios.put(`${Base_Url}/todos`, {
        oldItem: oldtodo,
        newItem: newtodo,
      });
      setEditmode(false);
      setNewtodo("");
      setOldtodo("");
      loadTodos();
    } catch (err) {
      console.error("Error editing todo:", err);
      setError("Failed to edit todo. Check backend.");
    }
  };

  // Delete todo
  const deleteTodo = async (todoItem) => {
    try {
      setError("");
      await axios.delete(`${Base_Url}/todos`, {
        data: { todoItem },
      });
      loadTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo. Check backend.");
    }
  };

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todo-item-container">
      <h1 className="title">Todo App</h1>
      <p className="sub-title">
        {editmode ? "Edit your todo item" : "Your todo items are listed below"}
      </p>

      {/* Show error if exists */}
      {error && <p className="error-text">{error}</p>}

      <div>
        {todos.map((todo, index) => (
          <div key={index} className="todoCard">
            <h3>{todo}</h3>
            <div>
              <img
                src={edit}
                className="edit-img"
                onClick={() => {
                  setEditmode(true);
                  setOldtodo(todo);
                  setNewtodo(todo);
                }}
              />
              <img
                src={bin}
                className="delete-img"
                onClick={() => deleteTodo(todo)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="todo-add-container">
        <input
          type="text"
          placeholder="New Todo"
          className="input-todo"
          value={newtodo}
          onChange={(e) => setNewtodo(e.target.value)}
        />
        <button
          className="btn-todo"
          onClick={() => {
            if (editmode) editTodo();
            else addTodo();
          }}
        >
          {editmode ? "Update Todo" : "Add Todo"}
        </button>
      </div>
    </div>
  );
}

export default App;
