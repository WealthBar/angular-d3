import {Component, TemplateRef, ViewContainerRef} from 'angular2/core'
import {NgFor} from 'angular2/common';
import {D3Chart, D3Element, D3Scale} from './chart'
import d3 = require('d3')

interface D3GradientStop {
  offset: string,
  color: string,
  opacity: number,
}

@Component({
  selector: 'd3-gradient',
  inputs: ['stops', 'x1', 'x2', 'y1', 'y2', 'id'],
  directives: [NgFor],
  template: `
    <linearGradient [attr.id]="id" [attr.x1]="x1" [attr.x2]="x2" [attr.y1]="y1" [attr.y2]="y2">
      <stop template="ngFor #s of stops" [attr.offset]="s.offset" [attr.stop-color]="s.color" [attr.stop-opacity]="s.opacity"></stop>
    </linearGradient>
  `
})
export class D3Gradient {
  private id: string
  private x1: string = '0%'
  private x2: string = '100%'
  private y1: string
  private y2: string
  private stops: D3GradientStop[]

  constructor(private _template: TemplateRef, private _view: ViewContainerRef) {
    _view.createEmbeddedView(_template)
  }
}
