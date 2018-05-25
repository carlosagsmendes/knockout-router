import ko from 'knockout';

export default class Task {
  constructor(id, title) {
    this.id = id;
    this.title = ko.observable(title);
    this.description = ko.observable('');
    this.user = ko.observable('');
  }
}
