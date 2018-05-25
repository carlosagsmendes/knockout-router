import ko from 'knockout';
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
class MyComponentViewModel {
  constructor() {
    this.isInitialized = ko.observable(false);
    this[INITIALIZED] = this.init();
    this.init = this.init.bind(this);
  }

  async init() {
    this.isInitialized(true);
    console.log('constructor werwerwer');
  }
}

ko.components.register('my-component', {
  viewModel: MyComponentViewModel,
  template: `<span data-bind="text: isInitialized"></span>`
});

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
    <pre data-bind="text: console.dir($data)"></pre>
  `;
}

ko.components.register('empty', {
  template: `<span>empty template</span>`
});
ko.components.register('task', { template: '<span>TASK</span>' });

ko.components.register('foo', { template: createOuterTemplate('foo') });
ko.components.register('bar', { template: createOuterTemplate('bar') });
ko.components.register('baz', { template: createInnerTemplate('baz') });
ko.components.register('qux', { template: createInnerTemplate('qux') });

Router.useRoutes({
  '/foo': [
    'foo',
    {
      '/': 'empty',
      '/baz': 'baz',
      '/qux': 'qux'
    }
  ],
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
  new Route('/', 'my-component'),
  new Route(
    '/tasks',
    {
      component: () => import('./tasks/tasks-viewmodel')
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
      //console.log('[router] navigating to', ctx.pathname);
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

ko.applyBindings({});
