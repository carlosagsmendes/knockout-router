import ko from 'knockout';
import { Router, Route } from '@profiscience/knockout-contrib-router';
import {
  initializerPlugin,
  INITIALIZED
} from '@profiscience/knockout-contrib-router-plugins-init';
import 'regenerator-runtime/runtime';

import Template from './task-template.html';

class TaskViewModel {
  constructor(ctx) {
    this.isInitialized = ko.observable(false);
    console.log('constructor viewmodel');
    this[INITIALIZED] = this.init();
    this.init = this.init.bind(this);

    this.saveTaskFunction = ctx.$parent.saveTask;
    this.selectedTask = ko.utils.arrayFirst(ctx.$parent.tasks(), function(
      task
    ) {
      return task.id.toString() === ctx.params.id;
    });

  }

  async init() {
    this.isInitialized(true);
    console.log('init viewmodel');
  }

  saveTask = () => {
    this.saveTaskFunction(this.selectedTask);
  };
}

export const viewModel = TaskViewModel;
export const template = Template;
