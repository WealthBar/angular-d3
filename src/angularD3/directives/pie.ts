import {Optional, Directive, ElementRef} from 'angular2/core'
import {D3Chart, D3Element, D3Margin} from './chart'
import d3 = require('d3');

export class D3PieBase extends D3Element {
  innerRadius: number = 0
  labelRadius: number = 0.7
  radiusAttr: string

  get radius() {
    if (this.radiusAttr === 'height') {
      return this.width / 2
    } else {
      return this.width / 2
    }
  }

  createArc(radius: number) {
    return d3.svg.arc<number>()
      .outerRadius(radius)
      .innerRadius(radius * this.innerRadius)
  }

  createLabelArc(radius, offset = 0) {
    return d3.svg.arc()
      .outerRadius(radius * this.labelRadius + offset)
      .innerRadius(radius * this.labelRadius + offset)
  }

  createArcTween(arc, initial = null) {
    return function(d) {
      if (this._current == null) {
        this._current = initial != null ? initial : d
      }
      var i = d3.interpolate(this._current, d)
      this._current = d
      return (t) => { return arc(i(t)) }
    }
  }

  redraw(data) {
    if (this.radiusAttr === 'height') {
      this.chart.width = this.height
    } else {
      this.chart.height = this.width
    }
  }
}

@Directive({
  selector: '[d3-pie]',
  inputs: [
    'name', 'value', 'label', 'labelOffset: label-offset', 'textAnchor: text-anchor', 'transition',
    'duration', 'innerRadius: inner-radius', 'color', 'labelRadius: label-radius',
    'colorScale: color-scale', 'avoidCollisions: avoid-collisions'
  ]
})
export class D3Pie extends D3PieBase implements D3Element {
  name: string
  transition: string = 'ease'
  duration: number = 500
  value: string = 'value'
  label: string = 'label'
  labelOffset = 12;
  dy = "0.35em"
  textAnchor = "middle"
  pie = d3.layout.pie().sort(null).value((d) => { return d[this.value] })
  color: string
  avoidCollisions: boolean

  private _center
  private _arc
  private _label
  private _colorScale

  constructor(chart: D3Chart, el: ElementRef, @Optional() margin?: D3Margin) {
    super(chart, el, margin)
    this._center = this.element.attr("class", "pie")
    this._label = this._center.append("text").attr("class", "arc-label")
  }

  get colorScale(): any { return this._colorScale }
  set colorScale(value: any) {
    if (d3.scale[value]) this._colorScale = d3.scale[value]()
  }

  redraw(data) {
    super.redraw(data)
    var radius = this.radius
    var arc = this.createArc(radius)
    var arcTween = this.createArcTween(arc)

    this._center.attr("transform", `translate(${radius} ${radius})`)

    var slices = this._center.selectAll("path.pie").data(this.pie(data))
    slices.enter().append("path")
      .attr("class", (d, i) => { return `pie pie-${i}` })
      .attr("d", arc)

    slices.style('fill', (d, i) => { return this.getColors(d, i) })
      .attr("class", (d, i) => { return `pie pie-${i}` })

    slices.transition().ease(this.transition).duration(this.duration)
      .attrTween("d", arcTween)

    slices.exit().remove

    if (this.label) {
      var prevbb = null
      var label = this._center.selectAll("text").data(this.pie(data))
      label.enter().append("text")
        .attr("class", (d, i) => { return `pie-label pie-label-${i}` })

      label.style('text-anchor', this.textAnchor)
        .attr("class", (d, i) => { return `pie-label pie-label-${i}` })
        .text((d, i) => { return d.data[this.label] })

      label.transition().ease(this.transition).duration(this.duration)
        .attr('transform', this.getLabelPosition(radius))

      label.exit().remove()
    }
  }

  private getLabelPosition(radius) {
    var padding = +this.labelOffset
    var avoidCollisions = this.avoidCollisions
    var labelArc = this.createLabelArc(radius)
    var prevbb;
    return function(d, i) {
      var position = labelArc.centroid(d)
      if (avoidCollisions) {
        var relativePosition = [position[0], position[1]]
        if (this._position) {
          relativePosition[0] -= this._position[0]
          relativePosition[1] -= this._position[1]
        }
        var bb = this.getBoundingClientRect()
        var thisbb = {
          left: bb.left + (relativePosition[0] - padding),
          top: bb.top + (relativePosition[1] - padding),
          right: bb.right + relativePosition[0] + padding,
          bottom: bb.bottom + relativePosition[1] + padding,
        }

        var hasCollision = !(thisbb.right < prevbb.left
          || thisbb.left > prevbb.right
          || thisbb.bottom < prevbb.top
          || thisbb.top > prevbb.bottom)

        if (prevbb && hasCollision) {
          var ctx = thisbb.left + (thisbb.right - thisbb.left) / 2
          var cty = thisbb.top + (thisbb.bottom - thisbb.top) / 2
          var cpx = prevbb.left + (prevbb.right - prevbb.left) / 2
          var cpy = prevbb.top + (prevbb.bottom - prevbb.top) / 2
          var offset = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2)) / 2
          var offsetArc = this.createLabelArc(radius, offset)
          position = offsetArc.centroid(d)
        }
        this._position = position
        prevbb = thisbb
      }
        return `translate(${position})`
    }
  }

  private getColors(d, i) {
    if (this.colorScale) return this.colorScale(i)
    if (this.color) return d[this.color]
    if (d.color) return d.color
  }
}
