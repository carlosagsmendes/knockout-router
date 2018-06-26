import ko from 'knockout';
import { Route } from '@profiscience/knockout-contrib-router';
import { INITIALIZED, initializerPlugin } from '@profiscience/knockout-contrib-router-plugins-init';
import 'regenerator-runtime/runtime';


export default class MyComponentViewModel {
  constructor(ctx) {
    this.isInitialized = ko.observable(false);
    this[INITIALIZED] = this.init(ctx);
    this.init = this.init.bind(this);
  }

  init(ctx) {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.isInitialized(true);
        resolve();
      }, 1000);
    });
    return p;
  }
}
