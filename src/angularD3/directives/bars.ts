import {Directive, ElementRef} from 'angular2/core'
import {D3Chart, D3Element, D3Scale} from './chart'
import d3 = require('d3')

@Directive({
  selector: '[d3-bars]',
  inputs: [
    'xDataName: x', 'yDataName: y', 'name', 'yScaleName: yscale',
    'xScaleName: xscale', 'order', 'width'
  ],
})
export class D3Bars implements D3Element {
  name: string
  order: number = 0
  width: number = 15
  xDataName: string
  yDataName: string
  yScaleName: string
  xScaleName: string

  private _barsElement
  private _xScale: D3Scale
  private _yScale: D3Scale

  constructor(private _chart: D3Chart, el: ElementRef) {
    this._barsElement = d3.select(el.nativeElement).attr("class", "bars")
    _chart.addElement(this)
  }

  redraw(data) {
    var bars = this._barsElement.selectAll("rect.bar").data(data)
    bars.exit().transition().duration(500)
      .attr("y", () => { return this._chart.innerHeight })
      .attr("height", 0)
      .remove()
    bars.transition().duration(500)
      .attr("x", (d: any) => { return this.x(d[this.xDataName]) - this.width / 2 })
      .attr("y", (d: any) => { return this.y(d[this.yDataName]) })
      .attr("height", (d: any) => { return this._chart.innerHeight - this.y(d[this.yDataName]) })
      .attr("width", this.width)
    bars.enter()
      .append("rect")
      .attr("class", (d, i) => { return `bar bar-${i}` })
      .attr("x", (d: any) => { return this.x(d[this.xDataName]) - this.width / 2 })
      .attr("y", () => { return this._chart.innerHeight })
      .attr("height", 0)
      .attr("width", this.width)
      .transition().duration(500)
      .attr("y", (d: any) => { return this.y(d[this.yDataName]) })
      .attr("height", (d: any) => { return this._chart.innerHeight - this.y(d[this.yDataName]) })
  }

  private get x() {
    return (this._xScale = this._xScale
      || this._chart.getScale(this.xScaleName || this.xDataName)).scale
  }

  private get y() {
    return (this._yScale = this._yScale
      || this._chart.getScale(this.yScaleName || this.yDataName)).scale
  }
}
