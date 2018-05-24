import Template from './task-template.html';

class Task {
  constructor(ctx) {
    console.log(ctx);
  }
}

export const viewModel = Task;
export const template = Template;
