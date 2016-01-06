import {Optional, Directive, ElementRef} from 'angular2/core'
import {D3Chart, D3Element, D3Scale, D3Margin} from './chart'
import d3 = require('d3');

@Directive({
  selector: '[d3-line]',
  inputs: [
    'xDataName: x', 'yDataName: y', 'name', 'yScaleName: yscale',
    'xScaleName: xscale', 'stroke'
  ],
})
export class D3Line extends D3Element {
  name: string
  stroke: string
  xDataName: any = 0
  yDataName: any = 1
  xScaleName: string
  yScaleName: string

  private _xScale: D3Scale
  private _yScale: D3Scale
  private _line
  private _linePath

  constructor(chart: D3Chart, el: ElementRef, @Optional() margin?: D3Margin) {
    super(chart, el, margin)
    this._linePath = this.element.append("path")
  }

  redraw(data) {
    this._line = this._line || d3.svg.line().x((d) => this.x(d)).y((d) => this.y(d))

    this._linePath.attr("class", `line line-${this.name || this.yDataName}`)
      .style("fill", "none")
      .style("stroke", this.stroke)

    this._linePath.datum(data).transition().duration(500).attr('d', this._line)
  }

  private get xScale() {
    return (this._xScale = this._xScale
      || this.getScale(this.xScaleName || this.xDataName)).scale
  }

  private get yScale() {
    return (this._yScale = this._yScale
      || this.getScale(this.yScaleName || this.yDataName)).scale
  }

  private x(d) { return this.xScale(d[this.xDataName]) }

  private y(d) { return this.yScale(d[this.yDataName]) }
}
