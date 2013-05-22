# AngularJS-D3 Module

A set of AngularJS directives that provides a declarative syntax for building
common charts using D3.

## Project Goals

This provides an AngularJS module called `ad3` which in turn provides a
declarative HTML syntax for using D3 with AngularJS. The syntax has been
inspired in part by [this blog post][radian] however since that project is not
currently open source I've begun work on building my own.

The first goal of this project is to create a simple reusable set of D3
directives that are sufficiently complete to be able to put together
[a chart like this](http://j.mp/10FJZNy) which requires the following features:

- Multiple charts with multiple y-axes
- Line, area and bar chart types
- A chart legend overlay
- A mouse/touch informative overlay
- Automatic and animated updates whenever source data is changed

While that example happens to be implemented using D3 and AngularJS it exists
as a single, all-in-one directive `<plan-chart>` and as such is not at all
reusable for future charting purposes.

D3 is an extremely powerful and flexible tool and it would be an enormous task
to try and provide a declarative syntax for every possible scenario in which d3
be useful. So for now I'm just developing a basic charting and graphing syntax
but I am interested in the larger possibilities. If you have ideas and are
interested in lending a hand, please open an issue, submit a pull request or
just ping me [@lucisferre](https://twitter.com/lucisferre). This could be the
beginning of beautiful friendship.

## Charting Directives

- d3-chart - Provides the top level directives meant to contain the rest of the
  chart declarations.
- d3-axis - Defines an axis and provide it's range and location (top, left,
  bottom, right)
- d3-area - Define an area graph
- d3-line - Defines a line graph
- d3-bars - Defines a set of bars for a bar chart


## Try it

This project uses Yeoman and provides a fully functional demo project under the
`/app` folder. To run it clone this repo and do:

```
npm install

# If you don't already have bower installed then install it with
npm install -g bower

bower install

grunt server
```

## Feature Roadmap

- [x] Basic chart forms for: Area, Line and Bars
- [x] Supports multiple axis and multiple charts can be stacked
- [ ] Dynamically updating charts supporting animations (should be able to
display and track incoming time-series data)
- [ ] Data source directives to declaratively specify and load external data
sources and support D3's built in parsers for CSV, TSV, etc.
- [ ] Support for customizable chart legends
- [ ] Mouse-over and touch-based overlay support
- [ ] Other common chart types: Scatter, Pie, Bullet
- [ ] Useful chart functionality, like regression lines for scatter plots

If you have any other ideas for me, or feel like contributing to help add any
of this missing functionality, I encourage you to submit a pull request.


## Differences with Radian

Radian provides it's own expression syntax. While I think this is cool, it's
outside the scope of what I want to build and I'm not sure if introducing
another expression syntax is necessarily a good idea. For now I'm building with
the assumption that it won't be needed.


[radian]: http://www.skybluetrades.net/blog/posts/2013/04/24/radian/
