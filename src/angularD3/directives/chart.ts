import {Input, Directive, ViewContainerRef, ElementRef} from 'angular2/core';
import d3 = require('d3');

export interface Margin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface D3Element {
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
  chart: any;
  debounce = 200;
  scales: D3Scale[] = []
  elements: D3Element[] = []

  private _margin: Margin = { top: 10, right: 10, bottom: 10, left: 10 };
  private _timeout;
  private _data: {}[];

  constructor(elementRef: ElementRef, public view: ViewContainerRef) {
    this.element = elementRef.nativeElement;
    this.chart = d3.select(this.element).attr('class', "d3").attr("width", "100%")
    window.addEventListener('resize', this.redraw)
  }

  get width() { return this.element.parentNode.offsetWidth; }

  get innerWidth() { return this.width - this.margin.left - this.margin.right }

  get height() { return this.element.parentNode.offsetHeight; }

  get innerHeight() { return this.height - this.margin.top - this.margin.bottom }

  addScale(scale: D3Scale) { this.scales.push(scale) }

  getScale(name: string): D3Scale {
    return this.scales.find((s) => { return s.name === name })
  }

  addElement(element: D3Element) { this.elements.push(element) }

  get margin() { return this._margin }
  set margin(value: Margin) {
    if (value) {
      if (this._margin == value) return;
      this._margin = value
      this.chart.attr("transform", `translate(${value.left || '0'}, ${value.top || '0'})`);
      this.redraw()
    }
  }

  get data() { return this._data }
  set data(value: any) {
    this._data = value
    if (this._timeout || this.width === 0 || this.height === 0) return;
    this.redraw()
  }

  redraw() {
    this._timeout = setTimeout(() => {
      this.scales.forEach((s) => { s.update(this._data) })
      this.elements.forEach((e) => { e.redraw(this._data) })
      this._timeout = null
    }, this.debounce)
  }
}
