import {Input, Directive, ElementRef} from 'angular2/core';
import d3 = require('d3');

export interface Margin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

/*
 * Directive
 * D3Chart is the base element in building charts with AngularD3
 * <d3-chart></d3-chart>
 */
@Directive({
  selector: 'd3-chart',
  inputs: ['margin', 'data'],
})
export class D3Chart {
  element: any;
  svg: any;
  chart: any;
  public margin: Margin;
  public data: any;

  constructor(elementRef: ElementRef) {
    this.element = elementRef.nativeElement;
    this.margin = this.margin || { top: 10, right: 10, bottom: 10, left: 10 };
    this.svg = d3.select(this.element).append('svg').attr('class', "d3")
      .attr("width", "100%")
      .attr("height", "100%");
    this.chart = this.svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  get width() { return this.element.offsetWidth; }

  get height() { return this.element.offsetHeight; }
}
