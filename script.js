// Here's where we select all the items in the HTML 

const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');

let todos = [];

// making sure the page doesn't refresh upon submitting 
todoForm.addEventListener('submit', function(event) {
  
  event.preventDefault();
  addTodo(todoInput.value); 
});

// here's where we add the todo item, if the item is not empty, we submit it with id, name and completed properties
function addTodo(item) {
  if (item !== '') {
    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };

    todos.push(todo);
    addToLocalStorage(todos); 

    todoInput.value = '';
  }
}
// function to render the todos to the page
function renderTodos(todos) {
  todoItemsList.innerHTML = '';

  todos.forEach(function(item) {
    const checked = item.completed ? 'checked': null;

    const li = document.createElement('li');
    li.setAttribute('class', 'item');
    li.setAttribute('data-key', item.id);
    if (item.completed === true) {
      li.classList.add('checked');
    }

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">X</button>
    `;
  
    todoItemsList.append(li);
  });

}
// function to add the todos to localStorage so we can get them if they are unchecked. 
// Make sure they are stored as strings (JSON.stringify)
function addToLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos(todos);
}
// function to get said items from localStorage once they are stored
// we have to parse them back to arrays from strings with JSON.parse
function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');
  if (reference) {
    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}
// toggle function to the value either completed or not completed
function toggle(id) {
  todos.forEach(function(item) {
    if (item.id == id) {
      item.completed = !item.completed;
    }
  });

  addToLocalStorage(todos);
}
// the function that can delete todos 
function deleteTodo(id) {
  todos = todos.filter(function(item) {
    return item.id != id;
  });

  addToLocalStorage(todos);
}

// here we must listen for the click and then decide what to do. If the user clicked on the .checkbox,
// then call taggle function by passing the id.
// if the user clicked on the .delete.button, then call the delete function by passing the id
todoItemsList.addEventListener('click', function(event) {
  if (event.target.type === 'checkbox') {
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  if (event.target.classList.contains('delete-button')) {
    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  } 
}); 

// function to fill the todos if localStorage is empty upon page load
function fillEmptyTodos() {
  axios.get("https://jsonplaceholder.typicode.com/todos/")
      .then(response => {
      const responseData = response.data;
      for (let i =0; i < 5; i++) { 
      console.log(responseData[i].title);
      addTodo(responseData[i].title); 
      }
    })
     .catch(error => console.error(error)); 
}    
 
// event listener that works on page load, and will fire the fillEmptyTodos function if localStorage
// is empty 
window.addEventListener("load", function() { 
  console.log(localStorage.getItem("todos") === '[]');
  if(!localStorage.getItem("todos") || localStorage.getItem("todos") === '[]') {
    fillEmptyTodos()
  } else {
    getFromLocalStorage();
  }
});    
