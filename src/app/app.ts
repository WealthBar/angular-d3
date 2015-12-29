/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {D3_DIRECTIVES} from '../angularD3';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app', // <app></app>
  providers: [],
  directives: [D3_DIRECTIVES],
  pipes: [],
  styles: [ require('./app.css') ],
  template: require('./app.html')
})
export class App {
  arcs: any
  dataUrl: string
  line: {}[]
  pie: {}[]

  constructor() {
    this.arcs = {
      arc1: { value: 60, label: '60%' },
      arc2: { value: 90, label: '90%' },
    }
    this.dataUrl = require('./data/data.csv')
  }

  lineLoaded(event) { this.line = event.rows; }

  pieLoaded(event) { this.pie = event.rows }
}
