'use strict';

window.addEventListener('hashchange', () => App.render());
window.addEventListener('load', () => App.render());

var Home = (function Home() {
  return { render, after_render };

  function addTodo() {
    const todoHtml = `
      <li class="item">
        <p>${new Date().getTime()}</p>
      </li>
    `

    document.querySelector('.list').insertAdjacentHTML('beforeend', todoHtml);
  }

  function render() {
    return `
     <section class="section">
       <h1> Home </h1>
       <ul class="list"></ul>
         <button class="add"> Add ToDo </button>
         <button class="to"> About </button>
     </section>
   `;
  }

  function after_render() {
    document.querySelector('.add').addEventListener('click', addTodo);

    document.querySelector('.to').addEventListener('click', function redirectTo() {
      location.hash = '/about';
    });
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
