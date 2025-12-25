import React, { useEffect, useState } from 'react'
import "./App.css"
import axios from 'axios';
import bin from "../src/bin.png"
import edit from "../src/edit.png"


function App() {
  const [todos,setTodos]=useState([]);
  const [newtodo,setNewtodo]=useState("");
  const [oldtodo,setOldtodo]=useState("");
  const [editmode,setEditmode]=useState(false);

const Base_Url = import.meta.env.VITE_API_URL;


    const loadTodos=async()=>{
    console.log("loading todos");
     
   
    const response=await axios.get(`${Base_Url}/todos`);
    console.log("response",response.data.data);
    setTodos(response.data.data);}

    const addTodo = async () => {
      await axios.post(`${Base_Url}/todos`, {
        todoItem: newtodo
      });
      setNewtodo("");
      loadTodos();
    };

    const editTodo=async()=>{
    axios.put(`${Base_Url}/todos`, {
      oldItem: oldtodo,
      newItem: newtodo
    });
      loadTodos();
      setEditmode(false);
      setNewtodo(""); 
      setOldtodo("");
    }

    const deleteTodo=async(todoItem)=>{
      const response=await axios.delete(`${Base_Url}/todos`,{
        data:{todoItem:todoItem},
      });
      loadTodos();
    }

  useEffect(()=>{
    loadTodos();
  },[])
  return (

    <div className='todo-item-container'>
      <h1 className='title'>Todo App</h1>
      <p className='sub-title'>
        {editmode ? "Edit your todo item" : "Your todo items are listed below"}
      </p>
    <div>
      {todos.map((todo,index)=>{
        return <div key={index} className='todoCard'>
          <h3>{todo}</h3>
          <div>
          <img src={edit} className='edit-img' onClick={()=>{
            setEditmode(true);
            setOldtodo(todo);
            setNewtodo(todo);

          }}/>

          <img src={bin} className='delete-img' onClick={()=>{
            deleteTodo(todo);
          }}/>
          </div>
        </div>
      })}
</div>

     <div className='todo-add-container'> 
      <input type='text' placeholder='New Todo' className='input-todo' value={newtodo} onChange={(e)=>{
        setNewtodo(e.target.value)
      }}/>
      <button className='btn-todo' onClick={()=>{
        if(editmode){
          editTodo()
        }else{
          addTodo();
        }
      }}>
        {editmode ? "Update Todo" : "Add Todo"}
      </button>
     </div>

    </div>
  )
}

export default App