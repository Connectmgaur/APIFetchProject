import React, { useState, useEffect } from "react";

const Form = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("https://playground.4geeks.com/apis/fake/todos/user/connectmgaur")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server sent an HTTP code: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        alert(error);
        console.log(error);
        if (error.message.includes("404")) {
          fetch("https://playground.4geeks.com/apis/fake/todos/user/connectmgaur", {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Server sent an HTTP code: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              alert(error);
            });
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todo.trim() !== "") {
      fetch("https://playground.4geeks.com/apis/fake/todos/user/connectmgaur", {
        method: "PUT",
        body: JSON.stringify([...todos, { label: todo, done: false }]),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`The error in the server is: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          alert(data.msg);
          setTodos([...todos, { label: todo, done: false }]);
          setTodo("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/connectmgaur/${index}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server sent an HTTP code: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container d-flex">
      <h1>Todos</h1>

      <form className="TodoForm" onSubmit={handleSubmit}>
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="todo-input"
          placeholder="What is the task today?"
        />

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <ul className="List">
        {todos.map((item, index) => (
          <li key={index}>
            <label>{item.label}</label>
            <p>{item.id}</p>
            <button className="btn-delete" onClick={() => handleDelete(index)}>
              <span>
                <i className="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div>{todos.length}</div>
    </div>
  );
};

export default Form;