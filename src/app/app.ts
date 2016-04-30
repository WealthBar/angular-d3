/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {D3_DIRECTIVES} from '../angularD3';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app', // <app></app>
  providers: [],
  directives: [D3_DIRECTIVES, CORE_DIRECTIVES],
  pipes: [],
  template: require('./app.html'),
})
export class App {
  dataUrl: string = require('./data/data.csv')
  pieDataUrl: string = require('./data/pieData.csv')
  line: {}[]
  pie: {}[]
  margin = { top: 40, right: 60, bottom: 40, left: 60 }
  columns = ['savings', 'total', 'optimal']
  tickValues = [200, 400, 600, 800]

  arcs = {
    arc1: { value: 60, label: '60%' },
    arc2: { value: 90, label: '90%' },
  }

  gradient = [
    { offset: '0%', color: '#098aae', opacity: 0.6 },
    { offset: '100%', color: '#684684', opacity: 0.9 },
  ]

  customTimeFormat = [
    ["%a %d", (d) => { return d.getDay() && d.getDate() !== 1 }],
    ["%b %d", (d) => { return d.getDate() !== 1 }],
    ["%b", (d) => { return d.getMonth() }],
    ["%Y", () => { return true }],
  ]

  constructor() {
    setInterval(() => {
      var val = Math.random() * 100
      this.arcs.arc1 = { value: val, label: `${val.toFixed(0)}%` }
      val = Math.random() * 100
      this.arcs.arc2 = { value: val, label: `${val.toFixed(0)}%` }
      var newPie = this.pie.slice()
      newPie.forEach((v: any) => {
        if (v.population < 1000000) {
          v.population *= 1.5
        } else {
          v.population *= 2 - 1.6 * Math.random()
        }
      })
      this.pie = newPie
    } , 1000 * 5)

    setInterval(() => {
      if (this.columns.length === 3) {
        this.columns = ['savings', 'optimal']
      } else {
        this.columns = ['savings', 'optimal', 'total']
      }
    } , 1000 * 5)
  }

  lineLoaded(event) { this.line = event.rows; }

  pieLoaded(event) {
    this.pie = event.rows
  }

  parseValues(row) {
    for (var key in row) {
      var value = row[key].trim()
      if (key === 'date') {
        row[key] = new Date(value)
      } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
        row[key] = +value.trim()
      }
    }
    return row
  }

  stackDomain(data) {
    return data.map((value) => {
      return +value.savings + value.total + value.optimal
    })
  }

  log(data) { console.log(data) }
}
