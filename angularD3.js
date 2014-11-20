//@ sourceMappingURL=angularD3.map
(function() {
  angular.module('ad3', []);

}).call(this);

//@ sourceMappingURL=arc.map
(function() {
  angular.module('ad3').directive('d3Arc', function() {
    var defaults;
    defaults = function() {
      return {
        x: 0,
        y: 1,
        innerRadius: 0,
        labelRadius: 0,
        transition: "cubic-in-out",
        transitionDuration: 1000,
        value: 'value',
        label: 'label'
      };
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var arcLabel, arcPath, center, chart, innerRadius, labelRadius, options, redraw;
        options = angular.extend(defaults(), attrs);
        chart = chartController.getChart();
        innerRadius = parseFloat(options.innerRadius);
        labelRadius = parseFloat(options.labelRadius);
        center = null;
        arcPath = null;
        arcLabel = null;
        redraw = function(data) {
          var arc, arcTween, labelArc, radius;
          center || (center = chartController.getChart().append("g").attr("class", "arc"));
          arcPath || (arcPath = center.append("path"));
          arcLabel || (arcLabel = center.append("text").attr("class", "arc-label").attr("dy", "0.35em").style("text-anchor", "middle"));
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          radius = Math.min(chartController.innerWidth, chartController.innerHeight) / 2;
          center.attr("transform", "translate(" + radius + "," + radius + ")");
          arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * innerRadius).startAngle(0).endAngle(function(d) {
            return d / 100 * 2 * Math.PI;
          });
          arcTween = function(d) {
            var i;
            if (this._current == null) {
              this._current = 0;
            }
            i = d3.interpolate(this._current, d);
            this._current = d;
            return function(t) {
              return arc(i(t));
            };
          };
          labelArc = d3.svg.arc().outerRadius(radius * labelRadius).innerRadius(radius * labelRadius);
          arcPath.datum(data[options.value]).transition().ease(options.transition).duration(options.transitionDuration).attrTween("d", arcTween);
          return arcLabel.text(data[options.label]);
        };
        return chartController.registerElement(redraw, options.order);
      }
    };
  });

}).call(this);

//@ sourceMappingURL=area.map
(function() {
  angular.module('ad3').directive('d3Area', function() {
    var defaults;
    defaults = function() {
      return {};
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var area, areaElement, areaStacked, options, redraw, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        if (options.vertical) {
          area = d3.svg.area().y(function(d) {
            return x(d.x);
          }).x0(0).x1(function(d) {
            return y(d.y);
          });
          areaStacked = d3.svg.area().y(function(d) {
            return x(d.x);
          }).x0(function(d) {
            return y(d.y0);
          }).x1(function(d) {
            return y(d.y + d.y0);
          });
        } else {
          area = d3.svg.area().x(function(d) {
            return x(d.x);
          }).y0(chartController.innerHeight).y1(function(d) {
            return y(d.y);
          });
          areaStacked = d3.svg.area().x(function(d) {
            return x(d.x);
          }).y0(function(d) {
            return y(d.y0);
          }).y1(function(d) {
            return y(d.y + d.y0);
          });
        }
        areaElement = null;
        redraw = function(data) {
          var charts, columns, mappedData, name, stack, stackedData, value;
          areaElement || (areaElement = chartController.getChart().append("g").attr("class", "area"));
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          if (options.y != null) {
            columns = options.y;
          }
          if (options.columns != null) {
            columns = scope.$eval(options.columns);
          }
          if (columns == null) {
            return;
          }
          if (angular.isString(columns)) {
            columns = columns.split(',').map(function(c) {
              return c.trim();
            });
          }
          if (columns.length === 0) {
            return;
          }
          mappedData = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = columns.length; _i < _len; _i++) {
              name = columns[_i];
              _results.push({
                name: name,
                values: (function() {
                  var _j, _len1, _results1;
                  _results1 = [];
                  for (_j = 0, _len1 = data.length; _j < _len1; _j++) {
                    value = data[_j];
                    _results1.push({
                      x: value[options.x],
                      y: value[name]
                    });
                  }
                  return _results1;
                })()
              });
            }
            return _results;
          })();
          stack = d3.layout.stack().values(function(d) {
            return d.values;
          });
          if (options.offset != null) {
            stack.offset(options.offset);
          }
          stackedData = stack(mappedData);
          charts = areaElement.selectAll('path.area').data(stackedData);
          charts.enter().append("path");
          charts.attr("class", function(d) {
            return "area " + d.name;
          }).transition().duration(500).attr("d", function(d, i) {
            if (i === 0) {
              return area(d.values);
            } else {
              return areaStacked(d.values);
            }
          });
          return charts.exit().attr("d", function(d, i) {
            if (i === 0) {
              return area(d.values);
            } else {
              return areaStacked(d.values);
            }
          }).remove();
        };
        if (options.columns != null) {
          scope.$watch(options.columns, chartController.redraw, true);
        }
        return chartController.registerElement(redraw, options.order);
      }
    };
  });

}).call(this);

//@ sourceMappingURL=axis.map
(function() {
  angular.module('ad3').directive('d3Axis', function() {
    var defaults;
    defaults = function() {
      return {
        orientation: 'bottom',
        ticks: '5',
        extent: false
      };
    };
    return {
      priority: 1,
      restrict: 'E',
      require: '^d3Chart',
      link: function($scope, $el, $attrs, chartController) {
        var adjustTickLabels, axisElement, drawGrid, getAxis, grid, label, options, positionLabel, range, redraw, scale, translation, updateScale;
        options = angular.extend(defaults(), $attrs);
        range = function() {
          if (options.orientation === 'top' || options.orientation === 'bottom') {
            if (options.reverse != null) {
              return [chartController.innerWidth, 0];
            } else {
              return [0, chartController.innerWidth];
            }
          } else {
            if (options.reverse != null) {
              return [0, chartController.innerHeight];
            } else {
              return [chartController.innerHeight, 0];
            }
          }
        };
        translation = function() {
          if (options.orientation === 'bottom') {
            return "translate(0, " + chartController.innerHeight + ")";
          } else if (options.orientation === 'top') {
            return "translate(0, 0)";
          } else if (options.orientation === 'left') {
            return "translate(0, 0)";
          } else if (options.orientation === 'right') {
            return "translate(" + chartController.innerWidth + ", 0)";
          }
        };
        if (options.scale === 'time') {
          scale = d3.time.scale();
        } else if (options.scale) {
          scale = d3.scale[options.scale]();
        } else {
          scale = d3.scale.linear();
        }
        getAxis = function() {
          var axis, format, tickSize;
          axis = d3.svg.axis().scale(scale).orient(options.orientation);
          if (options.ticks) {
            axis.ticks(options.ticks);
          }
          if (options.timeScale) {
            axis.ticks(d3.time[options.timeScale], options.timeInterval);
          }
          if (options.tickValues) {
            axis.tickValues($scope.$eval(options.tickValues));
          }
          if (options.tickSize) {
            tickSize = options.tickSize.split(',');
            axis.innerTickSize(tickSize[0]);
            axis.outerTickSize(tickSize[1]);
          }
          if (options.format != null) {
            format = d3.format(options.format);
            axis.tickFormat(format);
          }
          if (options.timeFormat != null) {
            format = d3.time.format(options.timeFormat);
            axis.tickFormat(function(value) {
              return format(new Date(value));
            });
          }
          return axis;
        };
        positionLabel = function(label) {
          if (options.orientation === 'bottom') {
            return label.attr("x", "" + (chartController.innerWidth / 2)).attr("dy", "" + chartController.margin.bottom).attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'top') {
            return label.attr("x", "" + (chartController.innerWidth / 2)).attr("dy", "" + (-chartController.margin.top)).attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'left') {
            return label.attr("x", "-" + (chartController.innerHeight / 2)).attr("dy", "" + (-chartController.margin.left + 18)).attr("style", "text-anchor: middle;").attr("transform", "rotate(-90)");
          } else if (options.orientation === 'right') {
            return label.attr("x", "" + (chartController.innerHeight / 2)).attr("dy", "" + (-chartController.margin.right + 18)).attr("style", "text-anchor: middle;").attr("transform", "rotate(90)");
          }
        };
        drawGrid = function(grid) {
          if (options.orientation === 'bottom') {
            return grid.call(getAxis().tickSize(chartController.innerHeight, 0, 0).tickFormat(''));
          } else if (options.orientation === 'top') {
            return grid.attr("transform", "translate(0, " + chartController.innerHeight + ")").call(getAxis().tickSize(chartController.innerHeight, 0, 0).tickFormat(''));
          } else if (options.orientation === 'left') {
            return grid.attr("transform", "translate(" + chartController.innerWidth + ", 0)").call(getAxis().tickSize(chartController.innerWidth, 0, 0).tickFormat(''));
          } else if (options.orientation === 'right') {
            return grid.call(getAxis().tickSize(chartController.innerWidth, 0, 0).tickFormat(''));
          }
        };
        adjustTickLabels = function(g) {
          var firstTickLabels, lastTickLabels, tickLabels;
          tickLabels = g.selectAll('.tick text');
          if (options.tickDy) {
            tickLabels.attr('dy', options.tickDy);
          }
          if (options.tickDx) {
            tickLabels.attr('dx', options.tickDx);
          }
          if (options.tickAnchor) {
            tickLabels.style('text-anchor', options.tickAnchor);
          }
          lastTickLabels = d3.select(tickLabels[0].slice(-1)[0]);
          if (options.lastTickDy) {
            lastTickLabels.attr('dy', options.lastTickDy);
          }
          if (options.lastTickDx) {
            lastTickLabels.attr('dx', options.lastTickDx);
          }
          if (options.lastTickAnchor) {
            lastTickLabels.style('text-anchor', options.lastTickAnchor);
          }
          firstTickLabels = d3.select(tickLabels[0][0]);
          if (options.firstTickDy) {
            firstTickLabels.attr('dy', options.firstTickDy);
          }
          if (options.firstTickDx) {
            firstTickLabels.attr('dx', options.firstTickDx);
          }
          if (options.listTickAnchor) {
            return firstTickLabels.style('text-anchor', options.firstTickAnchor);
          }
        };
        axisElement = null;
        grid = null;
        label = null;
        redraw = function(data) {
          var tickLabels;
          axisElement || (axisElement = chartController.getChart().append("g").attr("class", "axis axis-" + options.orientation + " axis-" + options.name).attr("transform", translation()));
          if (options.label) {
            label || (label = axisElement.append("text").attr("class", "axis-label").text(options.label));
          }
          if (options.grid) {
            grid || (grid = chartController.getChart().append("g").attr("class", "axis-grid axis-grid-" + options.name));
          }
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          if (label) {
            positionLabel(label.transition().duration(500));
          }
          axisElement.transition().duration(500).attr("transform", translation()).call(getAxis()).selectAll('tick text').tween("attr.dx", null).tween("attr.dy", null).tween("style.text-anchor", null);
          if (grid != null) {
            drawGrid(grid.transition().duration(500));
          }
          tickLabels = axisElement.selectAll('.tick text');
          return axisElement.call(adjustTickLabels);
        };
        updateScale = function(data) {
          var datum, domainValues;
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          scale.range(range());
          if (options.domain) {
            data;
          }
          if (options.filter) {
            domainValues = $scope.$eval("" + options.filter + "(data)", {
              data: data
            });
          } else {
            domainValues = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                datum = data[_i];
                _results.push(datum[options.name]);
              }
              return _results;
            })();
          }
          if (options.extent) {
            return scale.domain(d3.extent(domainValues));
          } else {
            return scale.domain([0, d3.max(domainValues)]);
          }
        };
        chartController.addScale(options.name, scale, updateScale);
        chartController.registerElement(redraw, options.order);
        if (options.tickValues != null) {
          return $scope.$watch(options.tickValues, chartController.redraw, true);
        }
      }
    };
  });

}).call(this);

//@ sourceMappingURL=bars.map
(function() {
  angular.module('ad3').directive('d3Bars', function() {
    var defaults;
    defaults = function() {
      return {
        x: 0,
        y: 1,
        width: 15
      };
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var barsElements, chart, height, options, redraw, width, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        chart = chartController.getChart();
        height = chartController.innerHeight;
        width = options.width;
        barsElements = null;
        redraw = function(data) {
          var bars;
          barsElements || (barsElements = chartController.getChart().append("g").attr("class", "bars"));
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          bars = barsElements.selectAll("rect.bar").data(data);
          bars.exit().transition().duration(500).attr("y", function(d) {
            return height;
          }).attr("height", 0).remove();
          bars.transition().duration(500).attr("x", function(d) {
            return x(d[options.x]) - width / 2;
          }).attr("y", function(d) {
            return y(d[options.y]);
          }).attr("height", function(d) {
            return height - y(d[options.y]);
          }).attr("width", width);
          return bars.enter().append("rect").attr("class", function(d, i) {
            return "bar bar-" + i;
          }).attr("x", function(d) {
            return x(d[options.x]) - width / 2;
          }).attr("width", width).attr("y", height).attr("height", 0).transition().duration(500).attr("y", function(d) {
            return y(d[options.y]);
          }).attr("height", function(d) {
            return height - y(d[options.y]);
          });
        };
        return chartController.registerElement(redraw, options.order);
      }
    };
  });

}).call(this);

//@ sourceMappingURL=chart.map
(function() {
  angular.module('ad3').directive('d3Chart', function() {
    return {
      restrict: 'EA',
      scope: true,
      controller: [
        '$scope', '$element', '$attrs', '$window', '$timeout', function($scope, $el, $attrs, $window, $timeout) {
          var binding, chart, debounce, elements, height, scales, sortOrder, svg, updateSize, width,
            _this = this;
          scales = $scope.scales = {};
          elements = $scope.elements = [];
          binding = $scope.binding = $attrs.data;
          this.margin = $scope.$eval($attrs.margin) || {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          };
          svg = d3.select($el[0]).append('svg').attr('class', "d3").attr("width", "100%").attr("height", "100%");
          width = function() {
            return $el[0].offsetWidth;
          };
          height = function() {
            return $el[0].offsetHeight;
          };
          chart = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
          this.getSvg = function() {
            return svg;
          };
          this.getChart = function() {
            return chart;
          };
          this.addScale = function(name, scale, update) {
            return scales[name] = {
              scale: scale,
              update: update
            };
          };
          this.getScale = function(name) {
            return scales[name].scale;
          };
          this.registerElement = function(el, order) {
            if (order == null) {
              order = 0;
            }
            return elements.push({
              redraw: el,
              order: Number(order)
            });
          };
          updateSize = function() {
            if (_this.width !== width() || _this.height !== height()) {
              _this.width = width();
              _this.height = height();
              _this.innerWidth = _this.width - _this.margin.left - _this.margin.right;
              _this.innerHeight = _this.height - _this.margin.top - _this.margin.bottom;
              return _this.redraw();
            }
          };
          sortOrder = function(a, b) {
            return a.order - b.order;
          };
          debounce = null;
          this.redraw = function() {
            if (debounce || _this.width === 0 || _this.height === 0) {
              return;
            }
            return debounce = $timeout(function() {
              var data, element, name, scale, _i, _len, _ref, _results;
              debounce = null;
              data = $scope.$eval(binding);
              for (name in scales) {
                scale = scales[name];
                scale.update(data);
              }
              _ref = elements.sort(sortOrder);
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                element = _ref[_i];
                _results.push(element.redraw(data));
              }
              return _results;
            }, $attrs.updateInterval || 200);
          };
          $window.addEventListener('resize', updateSize);
          if ($attrs.watch === 'deep') {
            $scope.$watch(binding, this.redraw, true);
          } else {
            $scope.$watch(binding, this.redraw);
          }
          $scope.$watch(updateSize);
          updateSize();
        }
      ]
    };
  });

}).call(this);

//@ sourceMappingURL=data.map
(function() {
  angular.module('ad3').directive('d3Data', [
    'd3Service', function(d3) {
      return {
        restrict: 'E',
        scope: false,
        link: function(scope, el, attrs) {
          var accessor, binding, callback, src;
          src = attrs.src;
          binding = attrs.data;
          if (attrs.accessor) {
            accessor = scope.$eval(attrs.accessor);
          }
          if (attrs.callback) {
            callback = scope.$eval(attrs.callback);
          }
          return d3.csv(src, accessor, callback).then(function(rows) {
            return scope[binding] = rows;
          }, function() {
            throw 'Error loading CSV via D3';
          });
        }
      };
    }
  ]);

}).call(this);

//@ sourceMappingURL=gradient.map
(function() {
  angular.module('ad3').directive('d3Gradient', function() {
    var defaults;
    defaults = {
      transition: 500
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function($scope, $el, $attrs, chartController) {
        var gradient, svg, transition;
        svg = chartController.getSvg();
        gradient = svg.insert("defs", 'g').append("linearGradient").attr("id", $attrs.ref);
        ['x1', 'x2', 'y1', 'y2'].forEach(function(attr) {
          return $attrs.$observe(attr, function(val) {
            return gradient.attr(attr, val);
          });
        });
        transition = defaults.transition;
        $attrs.$observe('transition', function(val) {
          if (val != null) {
            return transition = val;
          }
        });
        return $scope.$watch($attrs.stops, function(stops) {
          if (stops == null) {
            return;
          }
          stops = gradient.selectAll('stop').data(stops);
          stops.enter().append('stop');
          stops.attr('offset', function(d) {
            return d.offset;
          }).attr('stop-color', function(d) {
            return d.color;
          }).attr('stop-opacity', function(d) {
            if (d.opacity != null) {
              return d.opacity;
            } else {
              return 1;
            }
          });
          return stops.exit().remove();
        });
      }
    };
  });

}).call(this);

//@ sourceMappingURL=include.map
(function() {
  angular.module('ad3').directive('d3Include', function() {
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function($scope, $el, $attrs, chartController) {
        var chart, includes;
        chart = chartController.getChart();
        includes = chart.append('g').attr('class', 'includes');
        return includes.html($el.html());
      }
    };
  });

}).call(this);

//@ sourceMappingURL=line.map
(function() {
  angular.module('ad3').directive('d3Line', function() {
    var defaults;
    defaults = function() {
      return {
        x: 0,
        y: 1
      };
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var height, line, linePath, options, redraw, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        height = chartController.innerHeight;
        line = d3.svg.line().x(function(d) {
          return x(d[options.x]);
        }).y(function(d) {
          return y(d[options.y]);
        });
        linePath = null;
        redraw = function(data) {
          linePath || (linePath = chartController.getChart().append("path").attr("class", "line line-" + (options.name || options.y)).style("fill", "none").style("stroke", options.stroke));
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          return linePath.datum(data).transition().duration(500).attr("d", line);
        };
        return chartController.registerElement(redraw, options.order);
      }
    };
  });

}).call(this);

//@ sourceMappingURL=pie.map
(function() {
  angular.module('ad3').directive('d3Pie', function() {
    var defaults;
    defaults = function() {
      return {
        x: 0,
        y: 1,
        innerRadius: 0,
        labelRadius: 0.7,
        transition: "cubic-in-out",
        transitionDuration: 800,
        minOffset: 12,
        value: 'value'
      };
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var center, chart, colorScale, innerRadius, labelRadius, options, pie, redraw, _current;
        options = angular.extend(defaults(), attrs);
        chart = chartController.getChart();
        innerRadius = parseFloat(options.innerRadius);
        labelRadius = parseFloat(options.labelRadius);
        if (attrs.colors) {
          colorScale = (function() {
            switch (attrs.colors) {
              case 'category20':
                return d3.scale.category20();
              case 'category20b':
                return d3.scale.category20b();
              case 'category20c':
                return d3.scale.category20c();
            }
          })();
        }
        pie = d3.layout.pie().sort(null).value(function(d) {
          return d[options.value];
        });
        _current = null;
        center = null;
        redraw = function(data) {
          var arc, arcTween, getPosition, label, labelArc, padding, prevbb, radius, slice;
          center || (center = chartController.getChart().append("g").attr("class", "pie"));
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          radius = Math.min(chartController.innerWidth, chartController.innerHeight) / 2;
          center.attr("transform", "translate(" + radius + "," + radius + ")");
          arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * innerRadius);
          arcTween = function(a) {
            var i;
            i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
              return arc(i(t));
            };
          };
          labelArc = d3.svg.arc().outerRadius(radius * labelRadius).innerRadius(radius * labelRadius);
          slice = center.selectAll(".pie").data(pie(data));
          slice.enter().append("path").attr("class", function(d, i) {
            return "pie pie-" + i;
          }).attr("d", arc).each(function(d) {
            return this._current = d;
          });
          if (attrs.colors) {
            slice.style('fill', function(d, i) {
              if (colorScale) {
                return colorScale(i);
              } else {
                return d[attrs.color];
              }
            });
          }
          slice.exit().remove();
          slice.transition().ease(options.transition).duration(options.transitionDuration).attrTween("d", arcTween);
          if (options.label) {
            prevbb = null;
            padding = +options.minOffset;
            getPosition = function(d, i) {
              var cpx, cpy, ctx, cty, offset, offsetArc, position, relativePosition, thisbb;
              position = labelArc.centroid(d);
              if (options.avoidCollisions) {
                relativePosition = [position[0], position[1]];
                if (this._position) {
                  relativePosition[0] -= this._position[0];
                  relativePosition[1] -= this._position[1];
                }
                thisbb = _.transform(this.getBoundingClientRect(), function(r, v, k) {
                  switch (k) {
                    case 'left':
                      return r[k] = v - padding + relativePosition[0];
                    case 'top':
                      return r[k] = v - padding + relativePosition[1];
                    case 'right':
                      return r[k] = v + padding + relativePosition[0];
                    case 'bottom':
                      return r[k] = v + padding + relativePosition[1];
                  }
                });
                if (prevbb && !(thisbb.right < prevbb.left || thisbb.left > prevbb.right || thisbb.bottom < prevbb.top || thisbb.top > prevbb.bottom)) {
                  ctx = thisbb.left + (thisbb.right - thisbb.left) / 2;
                  cty = thisbb.top + (thisbb.bottom - thisbb.top) / 2;
                  cpx = prevbb.left + (prevbb.right - prevbb.left) / 2;
                  cpy = prevbb.top + (prevbb.bottom - prevbb.top) / 2;
                  offset = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2)) / 2;
                  offsetArc = d3.svg.arc().outerRadius(radius * labelRadius + offset).innerRadius(radius * labelRadius + offset);
                  position = offsetArc.centroid(d);
                }
                this._position = position;
                prevbb = thisbb;
              }
              return "translate(" + position + ")";
            };
            label = center.selectAll("text").data(pie(data));
            label.enter().append("text").style("text-anchor", "middle").attr("class", function(d, i) {
              return "pie-label pie-label-" + i;
            });
            label.exit().remove();
            label.text(function(d, i) {
              return data[i][options.label];
            });
            return label.transition().ease(options.transition).duration(options.transitionDuration).attr("transform", getPosition);
          }
        };
        return chartController.registerElement(redraw, options.order);
      }
    };
  });

}).call(this);

//@ sourceMappingURL=d3service.map
(function() {
  angular.module('ad3').provider('d3Service', function() {
    var defaults;
    defaults = this.defaults = {};
    this.$get = [
      '$cacheFactory', '$rootScope', '$q', function($cacheFactory, $rootScope, $q) {
        var cache;
        cache = defaults.cache || $cacheFactory('d3Service');
        return {
          csv: function(src, accessor, callback) {
            var cached, deferred;
            deferred = $q.defer();
            cached = cache.get(src);
            if (cached) {
              if (callback) {
                callback(rows);
              }
              deferred.resolve(cached);
            }
            d3.csv(src, accessor, function(rows) {
              return $rootScope.$apply(function() {
                if (callback) {
                  callback(rows);
                }
                if (rows) {
                  cache.put(src, rows);
                  return deferred.resolve(rows);
                } else {
                  return deferred.reject();
                }
              });
            });
            return deferred.promise;
          }
        };
      }
    ];
    return this;
  });

}).call(this);
