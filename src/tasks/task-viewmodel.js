import ko from 'knockout';
import Template from './task-template.html';

class TaskViewModel {
  constructor(ctx) {
    this.saveTaskFunction = ctx.$parent.saveTask;
    this.selectedTask = ko.utils.arrayFirst(ctx.$parent.tasks(), function(
      task
    ) {
      return task.id.toString() === ctx.params.id;
    });
  }

  saveTask = () => {
    this.saveTaskFunction(this.selectedTask);
  };
}

export const viewModel = TaskViewModel;
export const template = Template;
