import {Directive, Input, EventEmitter} from 'angular2/core';
import d3 = require('d3');

@Directive({
  selector: 'd3-data',
  inputs: ['src', 'accessor', 'callback'],
  outputs: ['data']
})
export class D3Data {
  accessor: (row: {[key: string]: string }) => {}
  callback: (rows: any[]) => void
  data = new EventEmitter();

  private _d3Data: D3DataService
  private _src: string

  constructor() {
    this._d3Data = new D3DataService()
  }

  get src(): string { return this._src }
  set src(value: string) {
    this._src = value
    if (this._src && this.src.length > 0) this.fetch()
  }

  fetch() {
    this._d3Data.csv(this._src, this.accessor, this.callback).then((rows) => {
      this.data.next({ rows: rows })
    }, () => {
      throw('Error loading CSV via D3')
    })
  }
}

export interface Cache {
  get(key: string)
  put(key: string, value: any)
}

export class DefaultCache {
  store = {}
  get(key: string) { return this.store[key] }
  put(key: string, value: any) { this.store[key] = value }
}

export class D3DataService {
  cache: Cache

  constructor() {
    this.cache = new DefaultCache()
  }

  csv(src, accessor?: (row: {[key: string]: string }) => {}, callback?: (rows: any[]) => void) {
    var p = new Promise((resolve, reject) => {
      var cached = this.cache.get(src)
      if (cached) {
        if (callback) callback(cached)
        resolve(cached)
      }
      d3.csv(src, accessor, (rows) => {
        if (callback) callback(rows)
        if (rows) {
          this.cache.put(src, rows)
          resolve(rows)
        } else {
          reject()
        }
      })
    })
    return p
  }
}
