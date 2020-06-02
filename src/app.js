'use strict';

window.addEventListener('load', () => App.render());
window.addEventListener('hashchange', () => App.render());

//* *******************************

var Home = (function Home() {
  var todosCollection = JSON.parse(localStorage.getItem('todoStorage')) || [];

  return { render, afterRender };

  //* *******************************

  async function renderTodo(todo) {
    const todoHtml = `
      <li class="todo-item" data-key="${todo.id}">
        <label for="${todo.id}" class="isRead">
          <input id="${todo.id}" type="checkbox"/>
        </label>
        <span>${todo.description}</span>
        <button class="delete" value="${todo.id}"> X </button>
      </li>
    `;

    await document.querySelector('.list').insertAdjacentHTML('beforeend', todoHtml);

    document
      .querySelector(`[value="${todo.id}"]`)
      .addEventListener('click', function removeOnClick() {
        deleteTodo(todo.id);
      });
  }

  function saveTodo(todo) {
    todosCollection.push(todo);
    localStorage.setItem('todoStorage', JSON.stringify(todosCollection));
  }

  function addTodo(todoDescription) {
    var todo = {
      description: todoDescription,
      done: false,
      id: Date.now(),
    };

    saveTodo(todo);
    renderTodo(todo);
  }

  function deleteTodo(id) {
    todosCollection = todosCollection.filter(function findByIdAndRemove(todo) {
      return !(todo.id == id);
    });
    localStorage.setItem('todoStorage', JSON.stringify(todosCollection));

    const elementToBeDeleted = document.querySelector(`[data-key='${id}']`);
    elementToBeDeleted.remove();
  }

  function loadTodos() {
    if (todosCollection) {
      todosCollection.forEach(function renderEach(todo) {
        renderTodo(todo);
      });
    }
  }

  function render() {
    return `
     <section class="section">
       <h1> Home </h1>
       <ul class="list"></ul>
       <label for="todoDescription" class="description">
         <input id="todoDescription"/>
       </label>
       <button class="add"> Add ToDo </button>
       <button class="to"> About </button>
     </section>
   `;
  }

  function afterRender() {
    loadTodos();

    document
      .querySelector('.add')
      .addEventListener('click', function addOnClick() {
        createTodo();
      });

    document
      .querySelector('#todoDescription')
      .addEventListener('keyup', function addOnKeyup(event) {
        if (event.key == 'Enter') {
          createTodo();
        }
      });

    document
      .querySelector('.to')
      .addEventListener('click', function redirectTo() { location.hash = '/about'; });

    function createTodo() {
      let todoDescription = document.querySelector('#todoDescription').value;
      if (todoDescription.trim() != '') {
        addTodo(todoDescription);
      }
    }
  }
}());

var About = (function About() {
  return { render, afterRender };

  //* *******************************

  function render() {
    return `
      <section class="section">
        <h1> About </h1>
          <button id="btn"> Home </button>
      </section>
    `;
  }

  function afterRender() {
    document
      .getElementById('btn')
      .addEventListener('click', function onClick() { location.hash = '/'; });
  }
}());

var App = (function App() {
  var root = document.getElementById('root');

  var routes = {
    '/': Home,
    '/about': About,
  };

  return { render };

  //* *******************************

  async function render() {
    const url = requestURL();
    const page = routes[url] || Home;
    root.innerHTML = await page.render();
    await page.afterRender();
  }

  function requestURL() {
    const [, resource = ''] = location.hash.slice(1).toLowerCase().split('/');
    return (`/${resource}`);
  }
}());
