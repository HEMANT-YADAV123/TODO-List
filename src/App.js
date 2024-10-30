import './App.css';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {useState} from 'react';
function App() {

  // Notification function.
  let createNotification = (type,message) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('cant add same task more than 1 time');
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
    }
  }
  //state handling
  let [todoList,settodoList] = useState([]);

  let saveToDoList = (event)=>{
  
      let todoName = event.target.todoName.value; //target is form so inside form go to todoName and picks its value.
      if(!todoList.includes(todoName))//repeatation is not allowed of inputs.
      {
        let finalDolist = [...todoList,todoName]//pahale vale elements + new element
        settodoList(finalDolist);//update the list.
        createNotification('success',`Added "${todoName}" to the list at index ${finalDolist.length - 1}`)(); // Show success notification
      }
      else
      {
        createNotification('info')();
      }
      event.preventDefault();//it is used to prevent the form to everytime gets refershed when something is saved or entered.
  }
  // Remove item from the list
  let removeToDoItem = (index,value) => {
    let updatedList = todoList.filter((_, i) => i !== index); // Remove item by index (filter has a callback function which has 2 params i.e value(that we haven't passed and index))
    settodoList(updatedList);
    createNotification('warning', `Deleted ${value} from index no. ${index}`)(); // Show removal notification
  };
  //
  let List = todoList.map((value,index)=>{
    return(
      <ToDoListItems value = {value} key={index} index = {index} removeItem={()=>removeToDoItem(index,value)}/>
    )
  })

  return (
    <div className="App">
      <NotificationContainer/>
      <h1>ToDo List</h1>
      <form onSubmit={saveToDoList}>
        <input type="text" name='todoName'/><button>save</button>
      </form>

      <div className='outerDiv'>
      <ul>
      {List}
      </ul>
      </div>
    </div>
  );
}

export default App;

function ToDoListItems({value,removeItem,index}){ //this is a component we could have created in different file.
  let [status,setstatus] = useState(false)

  let checkstatus = ()=>{
    setstatus(!status)
  }
  return(
    <li className={(status) ?  'completetodo' : ''} onClick={checkstatus}>{index+1 } {value}<span onClick={removeItem}>&times;</span></li>
  )

}