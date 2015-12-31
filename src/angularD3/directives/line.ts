import {Directive} from 'angular2/core';
import {D3Chart, D3Element, D3Scale} from './chart'
import d3 = require('d3');

@Directive({
  selector: 'd3-line',
  inputs: [
    'xDataName: x', 'yDataName: y', 'name', 'yScaleName: yscale',
    'xScaleName: xscale', 'stroke', 'order'
  ],
})
export class D3Line implements D3Element {
  name: string
  stroke: string
  xDataName: any = 0
  yDataName: any = 1
  xScaleName: string
  yScaleName: string
  order: number = 0

  private _chart: D3Chart
  private _xScale
  private _yScale
  private _line
  private _linePath

  constructor(chart: D3Chart) {
    this._chart = chart
    chart.addElement(this)
  }

  redraw(data) {
    this._line = this._line || d3.svg.line().x((d) => this.x(d)).y((d) => this.y(d))

    this._linePath = this._linePath || this._chart.chart.append('path')
      .attr("class", `line line-${this.name || this.yDataName}`)
      .style("fill", "none")
      .style("stroke", this.stroke)

    this._linePath.datum(data).transition().duration(500).attr('d', this._line)
  }

  private get xScale() {
    return (this._xScale = this._xScale
      || this._chart.getScale(this.xScaleName || this.xDataName).scale)
  }

  private get yScale() {
    return (this._yScale = this._yScale
      || this._chart.getScale(this.yScaleName || this.yDataName).scale)
  }

  private x(d) { return this.xScale(d[this.xDataName]) }

  private y(d) { return this.yScale(d[this.yDataName]) }
}
