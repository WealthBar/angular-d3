import {Optional, Directive, ElementRef} from 'angular2/core'
import {D3Chart, D3Element, D3Scale, D3Margin} from './chart'
import d3 = require('d3')

@Directive({
  selector: '[d3-area]',
  inputs: [
    'xDataName: x', 'yDataName: y', 'name', 'yScaleName: yscale',
    'xScaleName: xscale', 'stroke', 'columns', 'vertical',
    'offset'
  ],
})
export class D3Area extends D3Element {
  name: string
  vertical: boolean
  xDataName: string
  yDataName: string
  yScaleName: string
  xScaleName: string
  offset: any

  private _areaElement
  private _columns
  private _xScale: D3Scale
  private _yScale: D3Scale

  constructor(chart: D3Chart, el: ElementRef, @Optional() margin?: D3Margin) {
    super(chart, el, margin)
    this._areaElement = this.element.attr("class", "area")
  }

  get columns() {
    if (this._columns) {
      return this._columns
    } else {
      return [this.yDataName]
    }
  }
  set columns(value) {
    if (value instanceof String) {
      value = value.split(',').map((v) => { v.trim() })
    }
    if (Array.isArray(value)) {
      this._columns = value
      this.redraw()
    }
  }

  redraw(data = null) {
    data = data || this.data
    if (!data || data.length === 0) return;

    var stack = d3.layout.stack()
    if (this.offset) stack.offset(this.offset)
    stack.values((d: any) => { return d.values })

    var stackedData = stack(this.mapColumns(data))

    var area = this.getArea()
    var nullArea = this.getNullArea()
    var elements = this._areaElement.selectAll('path.area').data(stackedData)
    elements.enter()
      .append('path').attr('class', (d) => { return `area area-${d.name}` })
      .attr("d", nullArea)
    elements.transition().duration(500)
      .attr('class', (d) => { return `area area-${d.name}` })
      .attr("d", area)
    elements.exit()
      .transition().duration(500)
      .attr("d", nullArea)
      .remove()
  }

  private getNullArea() {
    var area = d3.svg.area<any>()
      .x((d, i) => { return this.x(d.x) })
      .y0(() => { return this.height })
      .y1(() => { return this.height })
    var areaStacked = d3.svg.area<any>()
      .x((d) => { return this.x(d.x) })
      .y0((d) => { return this.y(d.y0) })
      .y1((d) => { return this.y(d.y0) })
    return (d, i) => {
      if (i === 0) {
        return area(d.values)
      } else {
        return areaStacked(d.values)
      }
    }
  }

  private getArea() {
    if (this.vertical) {
      var area = d3.svg.area<any>()
        .y((d) => { return this.x(d.x) })
        .x0(0)
        .x1((d) => { return this.y(d.y) })
      var areaStacked = d3.svg.area<any>()
        .y((d) => { return this.x(d.x) })
        .x0((d) => { return this.y(d.y0) })
        .x1((d) => { return this.y(d.y + d.y0) })
    } else {
      var area = d3.svg.area<any>()
        .x((d) => { return this.x(d.x) })
        .y0(() => { return this.height })
        .y1((d) => { return this.y(d.y) })
      var areaStacked = d3.svg.area<any>()
        .x((d) => { return this.x(d.x) })
        .y0((d) => { return this.y(d.y0) })
        .y1((d) => { return this.y(d.y + d.y0) })
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
      || this.getScale(this.xScaleName || this.xDataName)).scale
  }

  private get y() {
    return (this._yScale = this._yScale
      || this.getScale(this.yScaleName || this.yDataName)).scale
  }
}
