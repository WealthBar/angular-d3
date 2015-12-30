import {Input, Directive, ElementRef} from 'angular2/core';
import d3 = require('d3');

export interface Margin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface D3Element {
  name: string
  order: number
  redraw(data: {}[]): void
}

export interface D3Scale {
  name: string
  scale
  update(data: {}[]): void
}

/*
 * Directive
 * D3Chart is the base element in building charts with AngularD3
 * <d3-chart></d3-chart>
 */
@Directive({
  selector: '[d3-chart]',
  inputs: ['margin', 'data', 'debounce'],
})
export class D3Chart {
  element: any;
  svg: any;
  chart: any;
  debounce = 200;
  scales: D3Scale[] = []
  elements: D3Element[] = []

  private _margin: Margin = { top: 10, right: 10, bottom: 10, left: 10 };
  private _timeout;
  private _data: {}[];

  constructor(elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
    this.svg = d3.select(this.element).append('svg').attr('class', "d3")
      .attr("width", "100%")
      .attr("height", "100%");
    this.chart = this.svg.append("g")
    window.addEventListener('resize', this.updateSize)
  }

  get width() { return this.element.offsetWidth; }

  get innerWidth() { return this.width - this.margin.left - this.margin.right }

  get height() { return this.element.offsetHeight; }

  get innerHeight() { return this.height - this.margin.top - this.margin.bottom }

  addScale(scale: D3Scale) { this.scales.push(scale) }

  getScale(name: string): D3Scale {
    return this.scales.find((s) => { return s.name === name })
  }

  addElement(element: D3Element) { this.elements.push(element) }

  get margin() { return this._margin }
  set margin(value: Margin) {
    if (value) {
      this._margin = value
      this.chart.attr("transform", `translate(${value.left || '0'}, ${value.top || '0'})`);
    }
  }

  get data() { return this._data }
  set data(value: {}[]) {
    this._data = value
    if (this._timeout || this.width === 0 || this.height === 0) return;
    this._timeout = setTimeout(() => {
      for (var scale of this.scales) {
        scale.update(this._data)
      }
      for (var element of this.elements.sort(this.sortOrder)) {
        element.redraw(this._data)
      }
    }, this.debounce)
  }

  updateSize() { }

  private sortOrder(a, b) { return a.order - b.order }
}
