import {Directive} from 'angular2/core'
import {D3Chart, D3Element, D3Scale} from './chart'
import d3 = require('d3')

@Directive({
  selector: 'd3-axis',
  inputs: [
    'name', 'label', 'extent', 'orientation', 'timeFormat: time-format',
    'filter', 'format', 'timeScale: time-scale', 'timeInterval: time-interval',
    'reverse', 'scale', 'customTimeFormat: custom-time-format', 'grid',
    'ticks', 'tickSize: tick-size', 'tickDx: tick-dx', 'tickDy: tick-dy',
    'tickAnchor: tick-anchor', 'order', 'firstTickDx: first-tick-dx',
    'firstTickDy: first-tick-dy', 'firstTickAnchor: first-tick-anchor',
    'lastTickDx: last-tick-dx', 'lastTickDy: last-tick-dy',
    'lastTickAnchor: last-tick-anchor', 'tickValues: tick-values',
  ]
})
export class D3Axis implements D3Element, D3Scale {
  name: string;
  format: string; timeFormat: string; timeScale: string; timeInterval: string;
  tickSize: string; tickDx: string; tickDy: string; tickAnchor: string;
  firstTickDx: string; firstTickDy: string; firstTickAnchor: string;
  lastTickDx: string; lastTickDy: string; lastTickAnchor: string;

  customTimeFormat: any[];
  tickValues: any[];
  filter: Function
  orientation = 'bottom'
  reverse = false
  extent = false
  ticks = 5
  order = 1

  private _label
  private _labelElement
  private _axisElement
  private _grid
  private _gridElement
  private _chart: D3Chart
  private _scale: any = d3.scale.linear()

  constructor(chart: D3Chart) {
    this._chart = chart
    chart.addScale(this)
    chart.addElement(this)
  }

  redraw(data) {
    this.updateAxis()
    this.updateLabel()
    this.updateGrid()
  }

  update(data) {
    if (!data || data.length < 0) return
    var scale = this._scale
    scale.range(this.range)
    var domain
    if (this.filter) {
      domain = this.filter(data)
    } else {
      domain = data.map((d) => d[this.name])
    }
    if (this.extent) {
      scale.domain(d3.extent(domain))
    } else {
      scale.domain([0, d3.max(domain)])
    }
  }

  get scale() { return this._scale }
  set scale(value: string) {
    if (value === 'time') {
      this._scale = d3.time.scale()
    } else if (value) {
      this._scale = d3.scale[value]()
    } else {
      this._scale = d3.scale.linear()
    }
  }

  private get grid() { return this._grid }
  private set grid(value) {
    this._grid = (value === 'true' || value === true)
    this.updateGrid()
  }

  private get label() { return this._label }
  private set label(value: string) {
    this._label = value
    if (this._labelElement) this._labelElement.text(value)
  }

  private get range(): [number, number] {
    var range;
    if (this.orientation === 'top' || this.orientation === 'bottom') {
      range = [0, this._chart.innerWidth]
    } else {
      range = [this._chart.innerHeight, 0]
    }
    if (this.reverse) { range = range.reverse() }
    return range
  }

  private get translation(): string {
    switch (this.orientation) {
      case 'bottom':
        return `translate(0, ${this._chart.innerHeight})`
      case 'right':
        return `translate(${this._chart.innerWidth}, 0)`
      default:
        return "translate(0, 0)"
    }
  }

  private createAxis() {
    var axis = d3.svg.axis().scale(this.scale).orient(this.orientation);
    if (this.ticks) axis.ticks(this.ticks);
    if (this.timeScale) axis.ticks(d3.time[this.timeScale], this.timeInterval);
    if (this.tickValues) axis.tickValues(this.tickValues);
    if (this.tickSize) {
      var tickSize = this.tickSize.split(',')
      axis.innerTickSize(+tickSize[0])
      axis.outerTickSize(+tickSize[1])
    }
    if (this.customTimeFormat) {
      // We copy this because D3 is bad and mutates the time format.
      // See: https://github.com/mbostock/d3/issues/1769
      var copy = Object.assign([] , this.customTimeFormat)
      var mf = d3.time.format.multi(copy)
      axis.tickFormat((d) => { return mf(new Date(d)) })
    }
    if (this.timeFormat) {
      var tf = d3.time.format(this.timeFormat)
      axis.tickFormat((d) => { return tf(new Date(d)) })
    } else if (this.format) {
      axis.tickFormat(d3.format(this.format))
    }
    return axis
  }

  private adjustTickLabels(axis) {
    var tickLabels = axis.selectAll('.tick text')
    if (this.tickDy) tickLabels.attr('dy', this.tickDy);
    if (this.tickDx) tickLabels.attr('dx', this.tickDx);
    if (this.tickAnchor) tickLabels.style('text-anchor', this.tickAnchor);

    var lastTickLabels = d3.select(tickLabels[0].slice(-1)[0]);
    if (this.lastTickDy) lastTickLabels.attr('dy', this.lastTickDy);
    if (this.lastTickDx) lastTickLabels.attr('dx', this.lastTickDx);
    if (this.lastTickAnchor) lastTickLabels.style('text-anchor', this.lastTickAnchor);

    var firstTickLabels = d3.select(tickLabels[0][0]);
    if (this.firstTickDy) firstTickLabels.attr('dy', this.firstTickDy);
    if (this.firstTickDx) firstTickLabels.attr('dx', this.firstTickDx);
    if (this.firstTickAnchor) firstTickLabels.style('text-anchor', this.firstTickAnchor);
  }

  private updateAxis() {
    if (!this._axisElement) {
      this._axisElement = this._chart.chart.append("g")
    }
    var axis = this._axisElement
    axis.attr("class", `axis axis-${this.orientation} axis-${this.name}`)
      .attr("transform", this.translation)
      .call(this.createAxis())

    this.adjustTickLabels(axis)
  }

  private updateLabel() {
    if (!this._axisElement) return
    if (!this._labelElement) {
      this._labelElement = this._axisElement
        .append("text")
        .attr("class", "axis-label")
    }
    this._labelElement.text(this._label)
    this.positionLabel(this._labelElement)
  }

  private positionLabel(label) {
    switch (this.orientation) {
      case 'bottom':
        label.attr("x", `${this._chart.innerWidth / 2}`)
          .attr("dy", `${this._chart.margin.bottom}`)
          .attr("style", "text-anchor: middle;")
        break;

      case 'top':
        label.attr("x", `${this._chart.innerWidth / 2}`)
          .attr("dy", `${-this._chart.margin.top}`)
          .attr("style", "text-anchor: middle;")
        break;

      case 'left':
        label.attr("x", `-${this._chart.innerHeight / 2}`)
          .attr("dy", `${-this._chart.margin.left + 18}`)
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(-90)")
        break;

      case 'right':
        label.attr("x", `${this._chart.innerHeight / 2}`)
          .attr("dy", `${-this._chart.margin.right + 18}`)
          .attr("style", "text-anchor: middle;")
          .attr("transform", "rotate(90)")
        break;
    }
  }

  private updateGrid() {
    if (this._grid && this._axisElement) {
      this._gridElement = this._gridElement || this._chart.chart.append("g")
        .attr("class", `axis-grid axis-grid-${this.name}`)
      this.drawGrid()
    } else if (this._gridElement) {
      this._gridElement.remove()
      this._gridElement = null
    }
  }

  private drawGrid() {
    var size; var transform;
    switch (this.orientation) {
      case 'bottom':
        size = this._chart.innerHeight
        break;

      case 'top':
        transform = `translate(0, ${this._chart.innerHeight})`
        size = this._chart.innerHeight
        break;

      case 'left':
        transform = `translate(${this._chart.innerWidth}, 0)`
        size = this._chart.innerWidth
        break;

      case 'right':
        size = this._chart.innerWidth
        break;
    }
    if (transform) this._gridElement.attr("transform", transform);
    var axis = this.createAxis().innerTickSize(size).outerTickSize(0).tickFormat('')
    this._gridElement.call(axis)
  }
}
