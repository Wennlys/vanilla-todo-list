'use strict';

window.addEventListener('load', () => App.renderContent());
window.addEventListener('hashchange', () => App.renderContent());
window.addEventListener('DOMContentLoaded', () => App.renderPage());

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
        <button class="delete" value="${todo.id}">
            <img src="public/assets/delete-button.svg" alt="Remove this To Do"/>
        </button>
      </li>
    `;

    await document.querySelector('.list').insertAdjacentHTML('beforeend', todoHtml);

    document
      .querySelector(`[value="${todo.id}"]`)
      .addEventListener('click', function deleteOnClick() {
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
     <main>
       <h1> ToDo List </h1>
       <ul class="list"></ul>
       <label for="todoDescription" class="description">
         <input id="todoDescription"/>
       </label>
       <button class="add">
        <img src="public/assets/add-button.svg" alt="Add new To Do" /> 
       </button>
       <button class="to"> About </button>
     </main>
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
      <main>
        <h1> About </h1>
          <button id="btn"> Home </button>
      </main>
    `;
  }

  function afterRender() {
    document
      .getElementById('btn')
      .addEventListener('click', function onClick() { location.hash = '/'; });
  }
}());

var Header = (function Header() {
  return { render, afterRender };

  function render() {
    return `
      <header>
        <ul class="nav-bar">
          <li><a href="#">Home</a></li>
          <li><a href="/#/about">Home</a></li>
        </ul>
      </header>
    `;
  }

  function afterRender() {

  }
}());

var Footer = (function Footer() {
  return { render, afterRender };

  function render() {
    return `
      <footer>
        <ul class="nav-bar">
          <li><a href="#">Home</a></li>
          <li><a href="/#/about">Home</a></li>
        </ul>
      </footer>
    `;
  }

  function afterRender() {

  }
}());

var App = (function App() {
  var root = document.getElementById('root');

  var routes = {
    '/': Home,
    '/about': About,
  };

  return { renderContent, renderPage };

  //* *******************************

  function renderPage() {
    root.insertAdjacentHTML('afterbegin', Header.render());
    root.insertAdjacentHTML('beforeend', '<div id="content">');
    root.insertAdjacentHTML('beforeend', Footer.render());
    renderContent();
  }

  function renderContent() {
    const url = requestURL();
    let page = routes[url] || Home;
    document.getElementById('content').innerHTML = page.render();
    page.afterRender();
  }

  function requestURL() {
    const [, resource = ''] = location.hash.slice(1).toLowerCase().split('/');
    return (`/${resource}`);
  }
}());
