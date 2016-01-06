import {Optional, Directive, ElementRef} from 'angular2/core'
import {D3Chart, D3Element, D3Scale, D3Margin} from './chart'
import d3 = require('d3')

@Directive({
  selector: '[d3-bars]',
  inputs: [
    'xDataName: x', 'yDataName: y', 'name', 'yScaleName: yscale',
    'xScaleName: xscale', 'barWidth: width'
  ],
})
export class D3Bars extends D3Element {
  name: string
  barWidth: number = 15
  xDataName: string
  yDataName: string
  yScaleName: string
  xScaleName: string

  private _barsElement
  private _xScale: D3Scale
  private _yScale: D3Scale

  constructor(chart: D3Chart, el: ElementRef, @Optional() margin?: D3Margin) {
    super(chart, el, margin)
    this._barsElement = this.element.attr("class", "bars")
  }

  redraw(data) {
    var bars = this._barsElement.selectAll("rect.bar").data(data)
    bars.exit().transition().duration(500)
      .attr("y", () => { return this.height })
      .attr("height", 0)
      .remove()
    bars.transition().duration(500)
      .attr("x", (d: any) => { return this.x(d[this.xDataName]) - this.barWidth / 2 })
      .attr("y", (d: any) => { return this.y(d[this.yDataName]) })
      .attr("height", (d: any) => { return this.height - this.y(d[this.yDataName]) })
      .attr("width", this.barWidth)
    bars.enter()
      .append("rect")
      .attr("class", (d, i) => { return `bar bar-${i}` })
      .attr("x", (d: any) => { return this.x(d[this.xDataName]) - this.barWidth / 2 })
      .attr("y", () => { return this.height })
      .attr("height", 0)
      .attr("width", this.barWidth)
      .transition().duration(500)
      .attr("y", (d: any) => { return this.y(d[this.yDataName]) })
      .attr("height", (d: any) => { return this.height - this.y(d[this.yDataName]) })
  }

  private get x() {
    return (this._xScale = this._xScale
      || this.getScale(this.xScaleName || this.xDataName)).scale
  }

  private get y() {
    return (this._yScale = this._yScale
      || this.getScale(this.yScaleName || this.yDataName)).scale
  }
}
