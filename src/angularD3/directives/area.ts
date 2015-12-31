import {Directive} from 'angular2/core'
import {D3Chart, D3Element, D3Scale} from './chart'
import d3 = require('d3')

@Directive({
  selector: 'd3-area',
  inputs: [
    'xDataName: x', 'yDataName: y', 'name', 'yScaleName: yscale',
    'xScaleName: xscale', 'stroke', 'order', 'columns', 'vertical',
    'offset'
  ],
})
export class D3Area implements D3Element {
  name: string
  order: number = 0
  vertical: boolean
  xDataName: string
  yDataName: string
  yScaleName: string
  xScaleName: string
  offset: any

  private _areaElement
  private _chart: D3Chart
  private _columns
  private _xScale
  private _yScale

  constructor(chart: D3Chart) {
    this._chart = chart
    chart.addElement(this)
  }

  get columns() {
    if (this._columns) {
      return this._columns
    } else {
      return [this.yDataName]
    }
  }
  set columns(value) {
    if (Array.isArray(value)) {
      this._columns = value
    } else if (value instanceof String) {
      this._columns = value.split(',').map((v) => { v.trim() })
    }
  }

  redraw(data) {
    this._areaElement = this._areaElement ||
      this._chart.chart.append("g").attr("class", "area")

    var stack = d3.layout.stack()
    if (this.offset) stack.offset(this.offset)
    stack.values((d: any) => { return d.values })

    var stackedData = stack(this.mapColumns(data))

    var area = this.getArea()
    var elements = this._areaElement.selectAll('path.area').data(stackedData)
    elements.enter()
      .append('path').attr('class', (d) => { return `area area-${d.name}` })
      .transition().duration(500)
      .attr("d", (d, i) => { return area(d, i) })
    elements.exit()
      .attr("d", (d, i) => { return area(d, i) })
      .remove()
  }

  private getArea() {
    if (this.vertical) {
      var area = d3.svg.area().y((d: any) => {
        return this.x(d.x)
      })
        .x0(0)
        .x1((d: any) => { return this.y(d.y) })
      var areaStacked = d3.svg.area()
        .y((d: any) => { return this.x(d.x) })
        .x0((d: any) => { return this.y(d.y0) })
        .x1((d: any) => { return this.y(d.y + d.y0) })
    } else {
      var area = d3.svg.area()
        .x((d: any) => {
          return this.x(d.x)
        })
        .y0(() => {
          return this._chart.innerHeight
        })
        .y1((d: any) => {
          return this.y(d.y)
        })
      var areaStacked = d3.svg.area()
        .x((d: any) => { return this.x(d.x) })
        .y0((d: any) => { return this.y(d.y0) })
        .y1((d: any) => { return this.y(d.y + d.y0) })
    }
    return (d, i) => {
      if (i === 0) {
        return area(d.values)
      } else {
        return areaStacked(d.values)
      }
    }
  }

  private mapColumns(data) {
    return this.columns.map((c) => {
      return {
        name: c,
        values: this.mapValues(data, c)
      }
    })
  }

  private mapValues(data, c) {
    return data.map((d) => {
      return {
        x: d[this.xDataName],
        y: d[c]
      }
    })
  }

  private get x() {
    return (this._xScale = this._xScale
      || this._chart.getScale(this.xScaleName || this.xDataName).scale)
  }

  private get y() {
    return (this._yScale = this._yScale
      || this._chart.getScale(this.yScaleName || this.yDataName).scale)
  }
}
