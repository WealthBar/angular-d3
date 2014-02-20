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
        transitionDuration: 1000
      };
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var center, chart, innerRadius, labelRadius, options, redraw;
        options = angular.extend(defaults(), attrs);
        chart = chartController.getChart();
        innerRadius = parseFloat(options.innerRadius);
        labelRadius = parseFloat(options.labelRadius);
        center = chartController.getChart().append("g").attr("class", "arc");
        redraw = function() {
          var arc, arcTween, data, labelArc, path, radius;
          data = scope.$eval(attrs.data);
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          radius = Math.min(chartController.innerWidth(), chartController.innerHeight()) / 2;
          center.attr("transform", "translate(" + radius + "," + radius + ")");
          arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * innerRadius).startAngle(0).endAngle(function(d) {
            return d.value / 100 * 2 * Math.PI;
          });
          labelArc = d3.svg.arc().outerRadius(radius * labelRadius).innerRadius(radius * labelRadius);
          arcTween = function(b) {
            var i;
            i = d3.interpolate({
              value: 0
            }, b);
            return function(t) {
              return arc(i(t));
            };
          };
          path = center.selectAll("path").data([
            {
              "value": data[options.amount]
            }
          ]);
          path.enter().append("path").transition().ease(options.transition).duration(options.transitionDuration).attrTween("d", arcTween);
          path.enter().append("text").attr("class", "arc-label").attr("dy", "0.35em").style("text-anchor", "middle").text(data[options.label]);
          return path.transition().ease(options.transition).duration(options.transitionDuration).attrTween("d", arcTween);
        };
        scope.$watch(attrs.data, redraw, true);
        return chartController.registerElement({
          redraw: redraw
        });
      }
    };
  });

}).call(this);

//@ sourceMappingURL=area.map
(function() {
  angular.module('ad3').directive('d3Area', function() {
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
        var area, areaStacked, areaStackedStart, areaStart, columns, height, options, redraw, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        height = chartController.innerHeight();
        columns = options.y.split(',').map(function(c) {
          return c.trim();
        });
        if (options.vertical) {
          areaStart = d3.svg.area().y(function(d) {
            return x(d[options.x]);
          }).x0(0).x1(0);
          area = d3.svg.area().y(function(d) {
            return x(d[options.x]);
          }).x0(0).x1(function(d) {
            return y(d[options.y]);
          });
          areaStackedStart = d3.svg.area().y(function(d) {
            return x(d.x);
          }).x0(function(d) {
            return y(d.y0);
          }).x1(function(d) {
            return y(d.y0);
          });
          areaStacked = d3.svg.area().y(function(d) {
            return x(d.x);
          }).x0(function(d) {
            return y(d.y0);
          }).x1(function(d) {
            return y(d.y + d.y0);
          });
        } else {
          areaStart = d3.svg.area().x(function(d) {
            return x(d[options.x]);
          }).y0(height).y1(height);
          area = d3.svg.area().x(function(d) {
            return x(d[options.x]);
          }).y0(height).y1(function(d) {
            return y(d[options.y]);
          });
          areaStackedStart = d3.svg.area().x(function(d) {
            return x(d.x);
          }).y0(function(d) {
            return y(d.y0);
          }).y1(function(d) {
            return y(d.y0);
          });
          areaStacked = d3.svg.area().x(function(d) {
            return x(d.x);
          }).y0(function(d) {
            return y(d.y0);
          }).y1(function(d) {
            return y(d.y + d.y0);
          });
        }
        redraw = function() {
          var chart, charts, data, name, stack, stackedData, temp, value;
          data = scope.$eval(attrs.data);
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          if (columns.length === 1) {
            chart = chartController.getChart().select("path.area");
            if (!chart[0][0]) {
              chart = chartController.getChart().append("path").attr("class", "area");
            }
            return chart.datum(data).transition().duration(500).attr("d", area);
          } else {
            temp = (function() {
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
                        x: Number(value[options.x]),
                        y: Number(value[name])
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
            stackedData = stack(temp);
            charts = chartController.getChart().selectAll('.area-stacked');
            if (charts[0].length === 0) {
              charts = charts.data(stackedData).enter().append("path").attr("class", function(d) {
                return "area area-stacked " + d.name;
              });
            } else {
              charts = charts.data(stackedData);
            }
            return charts.transition().duration(500).attr("d", function(d) {
              return areaStacked(d.values);
            });
          }
        };
        scope.$watch(attrs.data, redraw, true);
        return chartController.registerElement({
          redraw: redraw
        });
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
        format: null,
        extent: false
      };
    };
    return {
      priority: 1,
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var axis, axisElement, format, label, options, positionLabel, range, redraw, scale, translation;
        options = angular.extend(defaults(), attrs);
        range = function() {
          if (options.orientation === 'top' || options.orientation === 'bottom') {
            if (options.reverse != null) {
              return [chartController.innerWidth(), 0];
            } else {
              return [0, chartController.innerWidth()];
            }
          } else {
            if (options.reverse != null) {
              return [0, chartController.innerHeight()];
            } else {
              return [chartController.innerHeight(), 0];
            }
          }
        };
        translation = function() {
          if (options.orientation === 'bottom') {
            return "translate(0, " + (chartController.innerHeight()) + ")";
          } else if (options.orientation === 'top') {
            return "translate(0, 0)";
          } else if (options.orientation === 'left') {
            return "translate(0, 0)";
          } else if (options.orientation === 'right') {
            return "translate(" + (chartController.innerWidth()) + ", 0)";
          }
        };
        scale = d3.scale.linear();
        axis = d3.svg.axis().scale(scale).orient(options.orientation).ticks(options.ticks);
        if (options.format) {
          format = d3.format(options.format);
          axis.tickFormat(format);
        }
        positionLabel = function(label) {
          if (options.orientation === 'bottom') {
            return label.attr("x", "" + (chartController.innerWidth() / 2)).attr("dy", "" + chartController.margin.bottom).attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'top') {
            return label.attr("x", "" + (chartController.innerWidth() / 2)).attr("dy", "" + (-chartController.margin.top)).attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'left') {
            return label.attr("x", "-" + (chartController.innerHeight() / 2)).attr("y", "" + (-chartController.margin.left + 18)).attr("style", "text-anchor: middle;").attr("transform", "rotate(-90)");
          } else if (options.orientation === 'right') {
            return label.attr("x", "" + (chartController.innerHeight() / 2)).attr("dy", "" + (-chartController.margin.right + 18)).attr("style", "text-anchor: middle;").attr("transform", "rotate(90)");
          }
        };
        axisElement = chartController.getChart().append("g").attr("class", "axis axis-" + options.orientation + " axis-" + options.name).attr("transform", translation());
        if (options.label) {
          label = axisElement.append("text").attr("class", "axis-label").text(options.label);
        }
        redraw = function() {
          var data, datum, domainValues;
          data = scope.$eval(attrs.data);
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          scale.range(range());
          if (label) {
            positionLabel(label.transition().duration(500));
          }
          domainValues = (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              datum = data[_i];
              _results.push(new Number(datum[options.name]));
            }
            return _results;
          })();
          if (options.extent) {
            scale.domain(d3.extent(domainValues));
          } else {
            scale.domain([0, d3.max(domainValues)]);
          }
          axisElement.transition().duration(500).attr("transform", translation()).call(axis);
          axisElement.selectAll('line').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;");
          return axisElement.selectAll('path').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;");
        };
        scope.$watch(attrs.data, redraw, true);
        return chartController.addScale(options.name, {
          scale: scale,
          redraw: redraw
        });
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
        var chart, height, options, redraw, width, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        chart = chartController.getChart();
        height = chartController.innerHeight();
        width = options.width;
        redraw = function() {
          var bars, data;
          data = scope.$eval(attrs.data);
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          bars = chart.selectAll("rect.bar").data(data);
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
        scope.$watch(attrs.data, redraw, true);
        return chartController.registerElement({
          redraw: redraw
        });
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
        '$scope', '$element', '$attrs', '$window', '$timeout', function(scope, el, attrs, window, $timeout) {
          var chart, debounce, elements, redraw, scales, svg,
            _this = this;
          this.margin = scope.$eval(attrs.margin) || {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
          };
          svg = d3.select(el[0]).append('svg').attr('class', "d3").attr("width", attrs.width || "100%").attr("height", attrs.height || "100%");
          this.width = function() {
            return svg[0][0].scrollWidth;
          };
          this.height = function() {
            return svg[0][0].scrollHeight;
          };
          this.innerWidth = function() {
            return this.width() - this.margin.left - this.margin.right;
          };
          this.innerHeight = function() {
            return this.height() - this.margin.top - this.margin.bottom;
          };
          chart = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
          this.getChart = function() {
            return chart;
          };
          scales = {};
          elements = [];
          this.addScale = function(name, scale) {
            return scales[name] = scale;
          };
          this.getScale = function(name) {
            return scales[name].scale;
          };
          this.registerElement = function(el) {
            return elements.push(el);
          };
          debounce = null;
          redraw = function() {
            if (debounce) {
              $timeout.cancel(debounce);
            }
            return debounce = $timeout(function() {
              var element, name, scale, _i, _len, _results;
              for (name in scales) {
                scale = scales[name];
                scale.redraw();
              }
              _results = [];
              for (_i = 0, _len = elements.length; _i < _len; _i++) {
                element = elements[_i];
                _results.push(element.redraw());
              }
              return _results;
            }, 200);
          };
          window.addEventListener('resize', redraw);
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
          var binding, src;
          src = attrs.src;
          binding = attrs.data;
          return scope[binding] = d3.csv(src, attrs.columns.split(','));
        }
      };
    }
  ]);

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
        height = chartController.innerHeight();
        line = d3.svg.line().x(function(d) {
          return x(d[options.x]);
        }).y(function(d) {
          return y(d[options.y]);
        });
        linePath = chartController.getChart().append("path").attr("class", "line");
        redraw = function() {
          var data;
          data = scope.$eval(attrs.data);
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          return linePath.datum(data).transition().duration(500).attr("d", line);
        };
        scope.$watch(attrs.data, redraw, true);
        return chartController.registerElement({
          redraw: redraw
        });
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
        transitionDuration: 1000
      };
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var center, chart, innerRadius, labelRadius, options, pie, redraw;
        options = angular.extend(defaults(), attrs);
        chart = chartController.getChart();
        innerRadius = parseFloat(options.innerRadius);
        labelRadius = parseFloat(options.labelRadius);
        pie = d3.layout.pie().sort(null).value(function(d) {
          return d[options.amount];
        });
        center = chartController.getChart().append("g").attr("class", "pie");
        redraw = function() {
          var arc, data, datum, groups, labelArc, radius, reversedDataMap, _fn, _i, _len;
          data = scope.$eval(attrs.data);
          if (!((data != null) && data.length !== 0)) {
            return;
          }
          radius = Math.min(chartController.innerWidth(), chartController.innerHeight()) / 2;
          center.attr("transform", "translate(" + radius + "," + radius + ")");
          arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * innerRadius);
          labelArc = d3.svg.arc().outerRadius(radius * labelRadius).innerRadius(radius * labelRadius);
          reversedDataMap = {};
          _fn = function(datum) {
            return reversedDataMap[datum[options.amount]] = datum[options.value];
          };
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            _fn(datum);
          }
          groups = center.selectAll(".pie").data(pie(data)).enter().append("g");
          groups.attr("class", function(d, i) {
            return "pie pie-" + i;
          }).append("path");
          groups.append("text");
          center.selectAll(".pie text").data(pie(data)).attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + ")";
          }).attr("dy", "0.35em").style("text-anchor", "middle").text(function(d) {
            return reversedDataMap[d.value];
          });
          return center.selectAll(".pie path").data(pie(data)).attr("d", arc);
        };
        scope.$watch(attrs.data, redraw, true);
        return chartController.registerElement({
          redraw: redraw
        });
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
      '$cacheFactory', '$rootScope', function($cacheFactory, $rootScope) {
        var cache;
        cache = defaults.cache || $cacheFactory('d3Service');
        return {
          csv: function(src, columns) {
            var results;
            results = cache.get(src);
            if (results) {
              return results;
            }
            cache.put(src, results = []);
            d3.csv(src, function(row) {
              var datum, name, _i, _len;
              datum = {};
              for (_i = 0, _len = columns.length; _i < _len; _i++) {
                name = columns[_i];
                name = name.trim();
                datum[name] = row[name];
              }
              return datum;
            }, function(error, rows) {
              if (error != null) {
                return cache.remove(src);
              } else {
                results.push.apply(results, rows);
                return $rootScope.$apply();
              }
            });
            return results;
          }
        };
      }
    ];
    return this;
  });

}).call(this);
