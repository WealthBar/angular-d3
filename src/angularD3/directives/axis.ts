import {Directive, Host} from 'angular2/core'
import {D3Chart, D3Element, D3Scale} from './chart'
import d3 = require('d3')

@Directive({
  selector: 'd3-axis',
  inputs: [
    'name', 'label', 'extent', 'orientation', 'ticks', 'timeFormat', 'filter',
    'format', 'timeScale', 'timeInterval', 'tickSize', 'reverse', 'scale',
    'tickDx', 'tickDy', 'tickAnchor', 'order',
    'firstTickDx', 'firstTickDy', 'firstTickAnchor',
    'lastTickDx', 'lastTickDy', 'lastTickAnchor',
    'tickValues', 'customTimeFormat'
  ]
})
export class D3Axis implements D3Element, D3Scale {
  name: string; format: string; timeFormat: string;
  timeScale: string; timeInterval: string; tickSize: string;
  tickDx: string; tickDy: string; tickAnchor: string;
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
  private _grid: boolean
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
  private set grid(value: boolean) {
    this._grid = value
    this.updateGrid()
  }

  private get label() { return this._label }
  private set label(value: string) {
    this._label = value
    this.updateLabel()
  }

  private get range(): [number, number] {
    var range;
    if (this.orientation === 'top' || this.orientation === 'bottom') {
      range = [0, this._chart.innerWidth]
    } else {
      range = [this._chart.innerHeight, 0]
    }
    if (this.reverse) { range = range.reverse() }
    console.log(range)
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
      axis.tickFormat((value) => { return mf(new Date(value)) })
    }
    if (this.timeFormat) {
      var tf = d3.time.format(this.timeFormat)
      axis.tickFormat((value) => { return tf(new Date(value)) })
    } else if (this.format) {
      axis.tickFormat(d3.format(this.format))
    }
    return axis
  }

  private adjustTickLabels(elements) {
    var tickLabels = elements
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
      .transition().duration(500)
      .attr("transform", this.translation)
      .call(this.createAxis())
      .selectAll('.tick text')
        .tween("attr.dx", null)
        .tween("attr.dy", null)
        .tween("style.text-anchor", null)
        .call(this.adjustTickLabels)
  }

  private updateLabel() {
    if (!this._axisElement) return
    if (!this._labelElement) {
      this._labelElement = this._axisElement
        .append("text")
        .attr("class", "axis-label")
    }
    this._labelElement.call(this.positionLabel).text(this._label)
  }

  private positionLabel(elements) {
    var label = elements.transition().duration(500)
    switch (this.orientation) {
      case 'bottom':
        label.attr("x", `#{this._chart.innerWidth / 2}`)
        .attr("dy", `#{this._chart.margin.bottom}`)
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
    if (this._grid) {
      if (!this._gridElement) {
        this._gridElement = this._axisElement.append("g")
          .attr("class", `axis-grid axis-grid-${this.name}`)
      }
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
        transform = `translate(0, #{this._chart.innerHeight})`
        size = this._chart.innerHeight
        break;

      case 'left':
        transform = `translate(#{this._chart.innerWidth}, 0)`
        size = this._chart.innerWidth
        break;

      case 'right':
        size = this._chart.innerWidth
        break;
    }
    if (transform) this._gridElement.attr("transform", transform);
    var axis = this.createAxis().tickSize(0).tickFormat('')
    this._gridElement.call(axis)
  }
}
