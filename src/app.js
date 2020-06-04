'use strict';

window.addEventListener('DOMContentLoaded', () => App.renderPage());
window.addEventListener('hashchange', () => App.renderContent());

//* *******************************

var Helpers = (function Helpers() {
  return { sanitizeInput };

  function sanitizeInput(string) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match])).trim();
  }
}());

var Home = (function Home() {
  var todosCollection = JSON.parse(localStorage.getItem('todoStorage')) || [];

  return { render, afterRender };

  //* *******************************

  function renderTodo(todo) {
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
         <input id="todoDescription" placeholder="Add your todo"/>
         <button class="add-todo">
          <img src="public/assets/add-button.svg" alt="Add new To Do" />
         </button>
       </label>
       <a id="toAbout">About Me</a>
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
      .querySelector('a#toAbout')
      .addEventListener('click', function redirectToAbout() {
        location.hash = `${location.hash == '#/' && location.hash != '#/about' ? '/about' : '#/about'}`;
      });

    //* **************************

    function createTodo() {
      let todoDescription = document.querySelector('#todoDescription').value;
      todoDescription = Helpers.sanitizeInput(todoDescription);
      if (todoDescription != '' && /^(?=.{1,20}$).*/.test(todoDescription)) {
        addTodo(todoDescription);
      }
    }
  }
}());

var About = (function About() {
  return { render, afterRender };

  //* *******************************

  async function render() {
    const user = await fetch('https://api.github.com/users/wennlys').then((response) => response.json());
    return `
      <main class="about">
        <h1> About Me </h1>
          <img class="profile" src="${user.avatar_url}" alt="My profile image" />
          <h2>${user.name}</h2>
          <p>${user.bio}</p>
          <a href="${user.html_url}">My Repos</a>
          <a id="toHome">Home</a>
      </main>
    `;
  }

  function afterRender() {
    document
      .querySelector('a#toHome')
      .addEventListener('click', function redirectToAbout() {
        location.hash = '#/';
      });
  }
}());

var Header = (function Header() {
  return { render };

  function render() {
    return `
      <header></header>
    `;
  }
}());

var Footer = (function Footer() {
  return { render };

  function render() {
    return `
      <footer>
        <p>Wennlys Oliveira © 2020 <a style="color:#3A2995" href="https://github.com/Wennlys">github.com/Wennlys</a></p>
      </footer>
    `;
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

  async function renderPage() {
    root.insertAdjacentHTML('afterbegin', Header.render());
    root.insertAdjacentHTML('beforeend', '<div id="content">');
    await renderContent();
    root.insertAdjacentHTML('beforeend', Footer.render());
  }

  async function renderContent() {
    const url = requestURL();
    let page = routes[url] || Home;
    document.getElementById('content').innerHTML = await page.render();
    page.afterRender();
  }

  function requestURL() {
    const [, resource = ''] = location.hash.slice(1).toLowerCase().split('/');
    return (`/${resource}`);
  }
}());
