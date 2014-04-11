# AngularJS-D3 Module

A set of AngularJS directives that provides a declarative syntax for building
common charts using D3.

## Installing

AngularD3 is available via Bower as `angularD3`

```
bower install angularD3
```

## Project Goals

This provides an AngularJS module called `ad3` which in turn provides a
declarative HTML syntax for using D3 with AngularJS. The syntax has been
inspired in part by [Radian](https://github.com/openbrainsrc/Radian) however
at the time of starting this Radian was not available as an OSS project.

The goals of AngularD3 are:

- Provide a simple declarative syntax for common D3 graphs and charts
- An extensible core allowing for almost anything possible D3 to be expressed with a custom directive. You are able to both extend the existing chart visuals as well as create entirely new ones. One example might be adding special elements/labels that have their positions bound to data points based on the chart axes.
- Designed the "Angular Way (tm)" using similar style to extensibility and directive communication used by Angular directives like form and input. AngularD3 provides a `d3Chart` directive which provides `d3ChartController` analagously to `ngFormController` 
- 100% stylable via CSS, with some added D3 'sugar' like allowing the use of the built in color scales with pie charts or being able to bind to a color scale from data.
- The ability to create custom directives that can both extend existing chart layouts as well as create new ones.

The overall goal of this project is to create a basic set of D3
directives that are sufficiently complete for flexible
charts of most common types. To start: Bar, Line, Area, Pie, Arc. Additional 
chart elements, can be added either to enhance existing chart types or to create 
new ones simply by requiring `d3ChartController`.

AngularD3 is designed to provide enough flexibility to allow you to extend it with
custom directives to do anything you could conceive of with D3 with no limitations, but 
still provide a convenient set of default functionality. Creating most simple graphs 
should be built in, while unlimited customization is still possible with relative ease.

If you have ideas and are interested in lending a hand, please open an issue,
submit a pull request or just ping me
[@chrismnicola](https://twitter.com/chrismnicola). This could be the beginning
of beautiful friendship.

## Current Directives

- d3-chart - Provides the top level directives meant to contain the rest of the
  chart declarations.
- d3-data - Provides a declarative way to load data into the current scope
  directly from a URL
- d3-axis - Defines an axis and provide it's range and location (top, left,
  bottom, right)
- d3-area - Define an area graph
- d3-line - Defines a line graph
- d3-bars - Defines a set of bars for a bar chart

The directives are meant to be used to compost charts like so:

```html
  <d3-data src="data/data.csv" data="line" columns="year, savings, total, optimal"></d3-data>
  <d3-data src="data/donutData.csv" data="pie" columns="age,population"></d3-data>
  <div d3-chart>
    <d3-axis data="line" name="year" label="Year" extent="true" orientation="bottom" ticks="5"></d3-axis>
    <d3-axis data="line" name="savings" label="Deposits" orientation="left" ticks="5"></d3-axis>
    <d3-axis data="line" name="total" label="Savings" orientation="right" ticks="5"></d3-axis>
    <d3-line data="line" x="year" y="optimal" yscale="total"></d3-line>
    <d3-area data="line" x="year" y="total"></d3-area>
    <d3-bars data="line" x="year" y="savings"></d3-bars>
  </div>
```

The `d3-chart` directive will first append `<svg class="d3"><g></g></svg>` to
itself and then each inner directives will attach their own elements, using D3,
from there. The `d3ChartController` provides access to its root `<g></g>` element via
`getChart()` so that child directives can append themselves.

The `d3-data` directive provides a way of declaratively binding data, but this
is entirely optional and it simply is a convenient way to bind a CSV data from
any url directly to your current scope.

Documentation will be forthcoming as things develop but for now you will have
to rely on a quick reading of the code.

## Try it out

This project uses Yeoman and provides a fully functional demo project under the
`/app` folder. To run it clone this repo and do:

```
npm install
npm install -g bower
npm install -g grunt

# If you don't already have bower installed then install it with

bower install

grunt server
```

## Feature Roadmap

- [x] Basic chart forms for: Area, Line and Bars
- [x] Supports multiple axis and multiple charts can be stacked
- [x] Dynamically updating charts supporting animations (should be able to
display and track incoming time-series data)
- [x] Data source directives to declaratively specify and load external data
sources and support D3's built in parsers for CSV, TSV, etc.
- [ ] Customizable chart legends
- [ ] Customizable and flexible labels 
- [ ] Mouse and touch overlay support
- [ ] Scatter and Bubble plots
- [ ] Bullet charts
- [x] Stacked area charts

If you have any other ideas for me, or feel like contributing to help add any
of this missing functionality, I encourage you to submit a pull request.

## License

Angular-D3 is free software under the [MIT licence](http://opensource.org/licenses/MIT) and may be redistributed under the terms specified in the MIT-LICENSE file.
