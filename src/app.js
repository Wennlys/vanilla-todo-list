'use strict';

window.addEventListener('hashchange', () => App.render());
window.addEventListener('load', () => App.render());

var Home = (function Home() {
  var todosCollection = JSON.parse(localStorage.getItem('todoStorage')) || [];

  return { render, after_render };

  function saveTodo(todo) {
    todosCollection.push(todo);
    localStorage.setItem('todoStorage', JSON.stringify(todosCollection));
  }

  function renderNewTodo(todo) {
    const todoHtml = `
      <li class="todo-item" data-key="${todo.id}">
        <label for="${todo.id}" class="isRead">
          <input id="${todo.id}" type="checkbox"/>
        </label>
        <span>${todo.description}</span>
        <button class="delete"> X </button>
      </li>
    `

    document.querySelector('.list').insertAdjacentHTML('beforeend', todoHtml);
  }

  function addTodo(todoDescription) {
    var todo = {
      description: todoDescription,
      done: false,
      id: Date.now()
    }

    saveTodo(todo);
    renderNewTodo(todo);
  }

  function loadTodos() {
    if (todosCollection) {
      todosCollection.forEach(function renderEach(todo) {
        renderNewTodo(todo);
      })
    }
  }

  function render() {
    return `
     <section class="section">
       <h1> Home </h1>
       <ul class="list"></ul>
       <label for="todoDescription" class="description">
         <input id="todoDescription" />
       </label>
       <button class="add"> Add ToDo </button>
       <button class="to"> About </button>
     </section>
   `;
  }

  function after_render() {
    loadTodos();

    var descriptionInput = document.querySelector('#todoDescription');

    document
      .querySelector('.add')
      .addEventListener('click', function createTodoOnClick() {
        const todoDescription = descriptionInput.value;
        if (todoDescription.trim() != '') {
          addTodo(todoDescription);
        }
      })
      descriptionInput.addEventListener('keyup', function createTodoOnKeyup(event) {
        if (event.key == 'Enter') {
          const todoDescription = descriptionInput.value;
          if (todoDescription.trim() != '') {
            addTodo(todoDescription);
          }
        }
      });

    document
      .querySelector('.to')
      .addEventListener('click', function redirectTo() { location.hash = '/about' });
  }
})()

var About = (function About() {
  return { render, after_render };

  function render() {
    return `
      <section class="section">
        <h1> About </h1>
          <button id="btn"> Home </button>
      </section>
    `;
  }

  function after_render() {
    document.getElementById('btn').addEventListener('click', function onClick() {
      location.hash = '/';
    });
  }
})()

var App = (function App() {
  var root = document.getElementById('root');

  var routes = {
    '/': Home,
    '/about': About,
  };

  return {
    render
  };

  async function render() {
    const url = requestURL();
    const page = routes[url] || Home;
    console.log(page)
    root.innerHTML = await page.render();
    await page.after_render();
  }

  function requestURL() {
    const [, resource = ''] = location.hash.slice(1).toLowerCase().split('/');
    return ('/' + resource);
  }
})();
