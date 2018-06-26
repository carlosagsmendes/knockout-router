import ko from 'knockout';
import $ from 'jquery';

import { Router, Route } from '@profiscience/knockout-contrib-router';
import {
  initializerPlugin,
  INITIALIZED
} from '@profiscience/knockout-contrib-router-plugins-init';
import { componentPlugin } from '@profiscience/knockout-contrib-router-plugins-component';
import 'regenerator-runtime/runtime';

//Attach to window to enable Knockout Context Debugger
window.ko = ko;
ko.options.deferUpdates = true;

Router.use(loadingMiddleware);
Route.usePlugin(componentPlugin);
// Route.usePlugin(initializerPlugin);

function createOuterTemplate(foo) {
  return `
    <h1>${foo} <span data-bind="text: new Date().getMilliseconds()">TASK</span></h1>
<span data-bind="text: new Date().getMilliseconds()"></span>
    These begin with '/', so they route using the current (containing) router
    <br>
    <a data-bind="path: '/foo'">/foo</a>
    <a data-bind="path: '/bar'">/bar</a>

    <br>
    <br>

    This begins with './', so it is routed using the child (adjacent) router
    <br>
    <a data-bind="path: './baz'">./baz</a>
    <a data-bind="path: './qux'">./qux</a>
    <br>
    <br>

    This begins with '//', so it is routed using the root router
    <br>
    <pre data-bind="text: console.dir($data)"></pre>
    <a data-bind="path: '//${foo}/baz'">//${foo}/baz</a>
    <a data-bind="path: '//${foo}/qux'">//${foo}/qux</a>    
    <router></router>
  `;
}

function createInnerTemplate(foo) {
  return `
    <h2>${foo} INNER <span data-bind="text: new Date().getMilliseconds()">TASK</span></h2>

    These begin with '/', so they route using the current (containing) router
    <br>
    <a data-bind="path: './baz'">/baz</a>
    <a data-bind="path: './qux'">/qux</a>
  `;
}

class BazViewModel {
  constructor(ctx) {}
}

ko.components.register('empty', {
  template: `<span>empty template</span>`
});
ko.components.register('task', { template: '<span>TASK</span>' });

//ko.components.register('foo', { template: createOuterTemplate('foo') });
ko.components.register('bar', { template: createOuterTemplate('bar') });
ko.components.register('baz', {
  template: createInnerTemplate('baz'),
  viewModel: BazViewModel
});
ko.components.register('qux', { template: createInnerTemplate('qux') });

Router.useRoutes({
  // '/foo': [
  //   'foo',
  //   {
  //     '/': 'empty',
  //     '/baz': 'baz',
  //     '/qux': 'qux'
  //   }
  // ],
  '/bar': [
    'bar',
    {
      '/': 'empty',
      '/baz': 'baz',
      '/qux': 'qux'
    }
  ]
});

Router.useRoutes([
  new Route('/', {
    component: () => ({
      template: import('./components/my-component/my-component-template.html'),
      viewModel: import('./components/my-component/my-component-viewmodel'),
      synchronous: true
    })
  }),
  new Route(
    '/foo',
    {
      component: () => ({
        template: import('./components/foo-bar-baz/foo-bar-baz-outer-template.html'),
        viewModel: import('./components/foo-bar-baz/foo-bar-baz-viewmodel'),
        synchronous: true
      })
    },
    [
      new Route('/', 'empty'),
      new Route('/baz', {
        component: () => ({
          template: import('./components/foo-bar-baz/foo-bar-baz-inner-template.html'),
          viewModel: import('./components/foo-bar-baz/foo-bar-baz-viewmodel'),
          synchronous: true
        })
      }),
      new Route('/qux', {
        component: () => ({
          template: import('./components/foo-bar-baz/foo-bar-baz-inner-template.html'),
          viewModel: import('./components/foo-bar-baz/foo-bar-baz-viewmodel'),
          synchronous: true
        })
      })
    ]
  ),
  new Route('/initplugin', {
    component: () => ({
      template: import('./components/init-plugin/init-plugin-template.html'),
      viewModel: import('./components/init-plugin/init-plugin-viewmodel'),
      synchronous: true
    })
  }),
  new Route('/initpluginwithmiddleware', [
    loadTasks,
    {
      component: () => ({
        template: import('./components/init-plugin/init-plugin-template.html'),
        viewModel: import('./components/init-plugin/init-plugin-viewmodel'),
        synchronous: true
      })
    }
  ]),
  new Route(
    '/tasks',
    {
      component: ctx => {
        console.log('after loadTasks');
        return import('./tasks/tasks-viewmodel');
      }
    },
    [
      new Route('/', 'empty'),
      new Route('/task/:id', {
        component: () => import('./tasks/task-viewmodel')
      })
    ]
  )
]);

function loadingMiddleware(ctx) {
  return {
    beforeRender(/* done */) {
      console.log('beforeRender');
      ctx.observablePathName = ko.observable(ctx.path);
    },
    afterRender() {
      console.log(
        '[router ' + ctx.router.depth + '] navigated to:',
        ctx.pathname
      );
    },
    beforeDispose() {
      console.log('[router] navigating away from', ctx.pathname);
    },
    afterDispose() {
      console.log('[router] navigated away from', ctx.pathname);
    }
  };
}

// function loadTasks(ctx) {
//   // return promise for async middleware

//   return import('./api/tasks-data.json').then(tasks => {
//     setTimeout(() => {
//       ctx.data = {};
//       ctx.data.tasks = tasks;
//       console.log('tasks loaded!!!')
//     }, 1000);
//   });
// }

function loadTasks(ctx) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        myTask: 1
      });
    }, 1000);
  });
  promise.then(task => (ctx.task = task));

  //return promise;
}

// function loadTask(ctx) {
//   // if not passed in via `with` from Users.navigateToUser
//   if (!ctx.user) {
//     return $.get('/api/users/' + ctx.params.id).then((u) => ctx.user = u)
//   }
// }

ko.applyBindings({});
