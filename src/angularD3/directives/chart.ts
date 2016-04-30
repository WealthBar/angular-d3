import {Input, Directive, Optional, ElementRef} from 'angular2/core';
import d3 = require('d3');

export interface ID3Element {
  redraw(data: {}[]): void;
}

export class D3Element implements ID3Element {
  element
  _margin = { top: 0, left: 0, right: 0, bottom: 0 }

  constructor(
    public chart: D3Chart,
    public el: ElementRef,
    @Optional() private _marginEl?: D3Margin
  ) {
    this.element = d3.select(el.nativeElement)
    chart.addElement(this)
  }

  get margin() {
    if (this._marginEl) return this._marginEl.margin
    return this._margin
  }

  get nativeElement() { return this.el.nativeElement }

  get width() {
    if (this._marginEl) {
      return this._marginEl.width
    } else {
      return this.chart.width
    }
  }

  get height() {
    if (this._marginEl) {
      return this._marginEl.height
    } else {
      return this.chart.height
    }
  }

  get data() { return this.chart.data }

  getScale(name) { return this.chart.getScale(name) }

  redraw(data: {}[]) { return }
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
  inputs: ['data', 'debounce'],
})
export class D3Chart {
  element: any;
  chart: any;
  debounce = 200;
  scales: D3Scale[] = []
  elements: ID3Element[] = []

  private _timeout;
  private _data: {}[];

  constructor(elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
    this.chart = d3.select(this.element).attr('class', "d3-chart")
    window.addEventListener('resize', () => this.redraw())
  }

  get width() { return this.element.clientWidth; }
  set width(value: number) { this.chart.attr("width", `${value}px`) }

  get height() { return this.element.clientHeight; }
  set height(value: number) { this.chart.attr("height", `${value}px`) }


  addScale(scale: D3Scale) { this.scales.push(scale) }

  getScale(name: string): D3Scale {
    return this.scales.find((s) => { return s.name === name })
  }

  addElement(element: ID3Element) { this.elements.push(element) }

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

export interface Margin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

@Directive({
  selector: '[d3-margin]',
  inputs: ['margin: d3-margin'],
})
export class D3Margin implements ID3Element {
  element
  private _margin: Margin = { top: 0, left: 0, bottom: 0, right: 0 }

  constructor(public chart: D3Chart, public el: ElementRef) {
    this.element = d3.select(el.nativeElement)
    chart.addElement(this)
  }

  get width() {
    return this.chart.width - this.margin.left - this.margin.right
  }

  get height() { return this.chart.height - this.margin.top - this.margin.bottom }

  get margin() { return this._margin }
  set margin(value: Margin) {
    if (value) {
      if (this._margin === value) return;
      this._margin = value
      this.redraw()
      this.chart.redraw()
    }
  }

  redraw() {
    this.element
      .attr("transform", `translate(${this.margin.left || '0'} ${this.margin.top || '0'})`)
  }
}
