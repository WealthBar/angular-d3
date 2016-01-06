import {Optional, Directive, ElementRef} from 'angular2/core'
import {D3Chart, D3Element, D3Margin} from './chart'
import {D3PieBase} from './pie'
import d3 = require('d3');

@Directive({
  selector: '[d3-arc]',
  inputs: [
    'name', 'value', 'label', 'dy', 'textAnchor: text-anchor', 'transition',
    'duration', 'innerRadius: inner-radius'
  ]
})
export class D3Arc extends D3PieBase {
  name: string
  transition: string = 'ease'
  duration: number = 500
  value: string = 'value'
  label: string = 'label'
  dy = "0.35em"
  textAnchor = "middle"
  innerRadius: number = 0.6
  labelRadius: number = 0

  private _center
  private _arc
  private _label

  constructor(chart: D3Chart, el: ElementRef, @Optional() margin?: D3Margin) {
    super(chart, el, margin)
    this._center = d3.select(el.nativeElement).attr("class", "arc")
    this._arc = this._center.append("path").attr("class", "arc")
    this._label = this._center.append("text").attr("class", "arc-label")
  }

  redraw(data) {
    super.redraw(data)
    var radius = this.radius
    var labelArc = this.createLabelArc(radius)
    var arc = this.createArc(radius)
    var arcTween = this.createArcTween(arc, 0)

    this._center.attr("transform", `translate(${radius},${radius})`)


    this._label.attr("dy", this.dy).style("text-anchor", "middle").text(data[this.label])

    this._arc.datum(data[this.value])
      .transition().ease(this.transition).duration(this.duration)
      .attrTween("d", arcTween)
  }

  createArc(radius: number) {
     return super.createArc(radius).startAngle(0)
      .endAngle((d) => { return (d / 100) * 2 * Math.PI })
  }
}
