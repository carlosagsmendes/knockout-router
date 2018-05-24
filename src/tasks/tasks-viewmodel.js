import ko from 'knockout';
import Template from './tasks-template.html';

class TasksViewModel {
  constructor() {
    this.itemToAdd = ko.observable('');
    this.allItems = ko.observableArray([
      'Fries',
      'Eggs Benedict',
      'Ham',
      'Cheese'
    ]); // Initial items

    this.selectedItems = ko.observableArray(['Ham']); // Initial selection

    this.addItem = this.addItem.bind(this);
    this.removeSelected = this.removeSelected.bind(this);
    this.sortItems = this.sortItems.bind(this);
  }

  addItem() {
    if (this.itemToAdd() !== '' && this.allItems.indexOf(this.itemToAdd()) < 0)
      // Prevent blanks and duplicates
      this.allItems.push(this.itemToAdd());
    this.itemToAdd(''); // Clear the text box
  }

  removeSelected() {
    this.allItems.removeAll(this.selectedItems());
    this.selectedItems([]); // Clear selection
  }

  sortItems() {
    this.allItems.sort();
  }
}

export const viewModel = TasksViewModel;
export const template = Template;
