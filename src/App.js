import './App.css';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useEffect, useRef, useState } from 'react';

function App() {
  // Notification function.
  let createNotification = (type, message) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('Cannot add the same task more than once');
          break;
        case 'success':
          NotificationManager.success('Success message', message);
          break;
        case 'warning':
          NotificationManager.warning('Warning message', message, 3000);
          break;
        case 'error':
          NotificationManager.error('Error message', 'Click me!', 5000, () => {
            alert('callback');
          });
          break;
      }
    };
  };

  // State handling
  let [todoList, setTodoList] = useState([]);
  const inputRef = useRef(null);

  // Save tasks to localStorage whenever todoList changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(todoList)); // Save to localStorage
  }, [todoList]);

  // Load tasks from localStorage when the app mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTodoList(savedTasks); // Load tasks from localStorage
    }
  }, []);

  let saveToDoList = (event) => {
    event.preventDefault();
    let todoName = event.target.todoName.value;
    if (todoName.trim() === '') {
      createNotification('error', 'Task cannot be empty')();
      return;
    }
    if (!todoList.includes(todoName)) {
      let finalDoList = [...todoList, todoName];
      setTodoList(finalDoList);
      createNotification('success', `Added "${todoName}" to the list at index ${finalDoList.length - 1}`)();
    } else {
      createNotification('info')();
    }
    inputRef.current.value = ''; // Clear input field
  };

  // Remove item from the list
  let removeToDoItem = (index, value) => {
    let updatedList = todoList.filter((_, i) => i !== index);
    setTodoList(updatedList);
    createNotification('warning', `Deleted ${value} from index no. ${index}`)();
  };

  let List = todoList.map((value, index) => {
    return (
      <ToDoListItems value={value} key={index} index={index} removeItem={() => removeToDoItem(index, value)} />
    );
  });

  useEffect(() => {
    document.title = "Taskify";
  }, []);

  return (
    <div className="App">
      <NotificationContainer />
      <h1>ToDo List</h1>
      <form onSubmit={saveToDoList}>
        <input type="text" name="todoName" ref={inputRef} />
        <button>Save</button>
      </form>

      <div className="outerDiv">
        <ul>{List}</ul>
      </div>
    </div>
  );
}

export default App;

function ToDoListItems({ value, removeItem, index }) {
  let [status, setStatus] = useState(false);

  let checkStatus = () => {
    setStatus(!status);
  };

  return (
    <li className={status ? 'completetodo' : ''} onClick={checkStatus}>
      {index + 1} {value} <span onClick={removeItem}>&times;</span>
    </li>
  );
}
