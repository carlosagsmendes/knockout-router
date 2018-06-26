import ko from 'knockout';
import {
  initializerPlugin,
  INITIALIZED
} from '@profiscience/knockout-contrib-router-plugins-init';
import 'regenerator-runtime/runtime';

import Template from './tasks-template.html';
import Task from './task-model';
import '../bindings/enterkey';


class TasksViewModel {
  constructor(ctx) {
    debugger;
    this.idGenerator = 3; 
    this.itemToAdd = ko.observable(new Task(this.idGenerator++, ''));
    this.allItems = ko.observableArray([
      new Task(1, 'migrate to knockout 3.5'),
      new Task(2, 'migrate to ko router X'),
      new Task(3, 'migrate to jquery 3'),
    ]); 

    this.addItem = this.addItem.bind(this);
    this.remove = this.remove.bind(this);
    //adding the tasks to the context so we can use them in the child routes
    ctx.tasks = this.allItems;
    ctx.saveTask = this.saveTask;
    this.init = this.init.bind(this);
    this.data = ctx.data;
    this[INITIALIZED] = this.init();
  }

  async init() {
    debugger;
    console.log('init viewmodel');
  }

  saveTask = (item) => {
    console.log(`Saving ${item.title()}...`)
  }

  addItem() {
    if (this.itemToAdd() !== '' && this.allItems.indexOf(this.itemToAdd()) < 0)
      this.allItems.push(new Task(this.itemToAdd().id,this.itemToAdd().title()));
    this.itemToAdd(new Task(this.idGenerator++, '')) // Clear the text box
  }

  remove(item) {
    this.allItems.remove(item);
  }
}

export const viewModel = TasksViewModel;
export const template = Template;
