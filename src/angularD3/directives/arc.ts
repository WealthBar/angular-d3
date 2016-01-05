import {Directive, ElementRef} from 'angular2/core';
import {D3Chart, D3Element, D3Scale} from './chart'
import d3 = require('d3');

@Directive({
  selector: '[d3-arc]',
  inputs: [
    'name', 'value', 'label', 'dy', 'textAnchor: text-anchor', 'transition',
    'duration', 'innerRadius: inner-radius'
  ]
})
export class D3Arc implements D3Element {
  name: string
  innerRadius: number = 0.5
  labelRadius: number = 0
  transition: string = 'ease'
  duration: number = 500
  value: string = 'value'
  label: string = 'label'
  dy = "0.35em"
  textAnchor = "middle"

  private _center
  private _arc
  private _label

  constructor(private _chart: D3Chart, el: ElementRef) {
    this._center = d3.select(el.nativeElement).attr("class", "arc")
    this._arc = this._center.append("path").attr("class", "arc")
    this._label = this._center.append("text").attr("class", "arc-label")
    _chart.addElement(this)
  }

  redraw(data) {
    var radius = this.calculateRadius()
    var arc = this.createArc(radius)
    var labelArc = this.createLabelArc(radius)
    var arcTween = function(d) {
      this._current = this._current || 0
      var i = d3.interpolate(this._current, d)
      this._current = d
      return (t) => { return arc(i(t)) }
    }

    this._center.attr("transform", `translate(${radius},${radius})`)

    this._label.attr("dy", this.dy).style("text-anchor", "middle").text(data[this.label])

    this._arc.datum(data[this.value])
      .transition().ease(this.transition).duration(this.duration)
      .attrTween("d", arcTween)
  }

  private createArc(radius: number) {
    return d3.svg.arc<number>()
      .outerRadius(radius)
      .innerRadius(radius * this.innerRadius)
      .startAngle(0)
      .endAngle((d) => { return (d / 100) * 2 * Math.PI })
  }

  private createLabelArc(radius) {
    return d3.svg.arc()
      .outerRadius(radius * this.labelRadius)
      .innerRadius(radius * this.labelRadius)
  }

  private calculateRadius() {
    return Math.min(this._chart.innerWidth, this._chart.innerHeight) / 2
  }
}
