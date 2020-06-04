'use strict';

window.addEventListener('DOMContentLoaded', () => App.renderPage());

window.addEventListener('load', () => App.renderContent());
window.addEventListener('hashchange', () => App.renderContent());

//* *******************************

var Home = (function Home() {
  var todosCollection = JSON.parse(localStorage.getItem('todoStorage')) || [];

  return { render, afterRender };

  //* *******************************

  function renderTodo(todo) {
    console.log(todosCollection[0]);
    const defaultDeleteButtonImage = 'public/assets/delete-button.svg';
    const redDeleteButtonImage = 'public/assets/red-delete-button.svg';

    const todoHtml = `
      <li class="todo-item ${todo.isDone ? 'toggled' : 'untoggled'}" data-key="${todo.id}">
        <div id="${todo.id}" class="label">
          <input id="${todo.id}" type="checkbox"/>
          <span>${todo.description}</span>
        </div>
        <button class="delete-todo" value="${todo.id}">
          <img src="${todo.isDone ? redDeleteButtonImage : defaultDeleteButtonImage}" alt="Remove this To Do"/>
        </button>
      </li>
    `;

    document.querySelector('.todo-list').insertAdjacentHTML('beforeend', todoHtml);

    var item = document.querySelector(`li[data-key="${todo.id}"]`);
    if (item) {
      document.querySelector(`div[id="${todo.id}"]`).addEventListener('click', function toggleOnClick() {
        // CSS Toggle/Untoggle

        item.classList.toggle('toggled');
        let toggledImgElement = document.querySelector(`.toggled[data-key="${todo.id}"] button img`);
        if (toggledImgElement) {
          toggledImgElement.src = redDeleteButtonImage;
        } else {
          document.querySelector(`button[value="${todo.id}"] img`).src = defaultDeleteButtonImage;
        }

        updateTodoStatus(todo);
      });
    }

    document
      .querySelector(`button[value="${todo.id}"]`)
      .addEventListener('click', function deleteOnClick() {
        deleteTodo(todo.id);
      });
  }

  function updateTodoStatus(todo) {
    const index = todosCollection.indexOf(todo);
    todosCollection[index].isDone = !todo.isDone;
    localStorage.setItem('todoStorage', JSON.stringify(todosCollection));
  }

  function saveTodo(todo) {
    todosCollection.push(todo);
    localStorage.setItem('todoStorage', JSON.stringify(todosCollection));
  }

  function addTodo(todoDescription) {
    var todo = {
      description: todoDescription,
      isDone: false,
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
     <main class="home">
       <div class="title">
        <hr class="title-hr" />
        <h1>ToDo<span class="light-weight">List</span></h1>
        <hr class="title-hr" />
       </div>
       <ul class="todo-list"></ul>
       <label for="todoDescription" class="description">
         <input id="todoDescription"/>
       </label>
       <button class="add-todo">
        <img src="public/assets/add-button.svg" alt="Add new To Do" /> 
       </button>
       <button class="to"> About </button>
     </main>
   `;
  }

  function afterRender() {
    loadTodos();

    document
      .querySelector('.add-todo')
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
          <li><a href="#">Footer</a></li>
          <li><a href="/#/about">Footer</a></li>
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
