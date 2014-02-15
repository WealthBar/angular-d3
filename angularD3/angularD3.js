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
        var arc, arcTween, center, chart, draw, height, innerRadius, labelArc, labelRadius, options, radius, width;
        options = angular.extend(defaults(), attrs);
        chart = chartController.getChart();
        height = chartController.innerHeight();
        width = chartController.innerWidth();
        innerRadius = parseFloat(options.innerRadius);
        labelRadius = parseFloat(options.labelRadius);
        radius = Math.min(width, height) / 2;
        arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * innerRadius).startAngle(0).endAngle(function(d) {
          return d.value / 100 * 2 * Math.PI;
        });
        labelArc = d3.svg.arc().outerRadius(radius * labelRadius).innerRadius(radius * labelRadius);
        width = chartController.innerWidth();
        height = chartController.innerHeight();
        center = chartController.getChart().append("svg:g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        arcTween = function(b) {
          var i;
          i = d3.interpolate({
            value: 0
          }, b);
          return function(t) {
            return arc(i(t));
          };
        };
        draw = function(data, old, scope) {
          var path;
          if (data == null) {
            return;
          }
          path = center.selectAll("path").data([
            {
              "value": data[options.amount]
            }
          ]);
          path.enter().append("path").attr("class", "arc").transition().ease(options.transition).duration(options.transitionDuration).attrTween("d", arcTween);
          path.transition().ease(options.transition).duration(options.transitionDuration).attrTween("d", arcTween);
          return path.enter().append("text").attr("dy", "0.35em").style("text-anchor", "middle").text(data[options.label]);
        };
        return scope.$watch(attrs.data, draw, true);
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
        var area, areaStart, draw, height, options, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        height = chartController.innerHeight();
        areaStart = d3.svg.area().x(function(d) {
          return x(d[options.x]);
        }).y0(height).y1(height);
        area = d3.svg.area().x(function(d) {
          return x(d[options.x]);
        }).y0(height).y1(function(d) {
          return y(d[options.y]);
        });
        draw = function(data) {
          if (data == null) {
            return;
          }
          return chartController.getChart().append("path").attr("class", "area").datum(data).attr("d", areaStart).transition().duration(500).attr("d", area);
        };
        return scope.$watch(attrs.data, draw, true);
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
        label: 'axis',
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
        var axis, format, label, options, positionLabel, range, scale, translation, update, xAxis;
        options = angular.extend(defaults(), attrs);
        range = function() {
          if (options.orientation === 'top' || options.orientation === 'bottom') {
            return [0, chartController.innerWidth()];
          } else {
            return [chartController.innerHeight(), 0];
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
        scale.range(range());
        chartController.addScale(options.name, scale);
        update = function(data) {
          var datum, domainValues;
          if (data == null) {
            return;
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
          axis.call(xAxis);
          axis.selectAll('line').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;");
          return axis.selectAll('path').attr("style", "fill: none; stroke-width: 2px; stroke: #303030;");
        };
        scope.$watch(options.data, update, true);
        xAxis = d3.svg.axis().scale(scale).orient(options.orientation).ticks(options.ticks);
        if (options.format) {
          format = d3.format(options.format);
          xAxis.tickFormat(format);
        }
        axis = chartController.getChart().append("g").attr("class", "axis axis-" + options.orientation).attr("transform", translation());
        positionLabel = function(label) {
          if (options.orientation === 'bottom') {
            return label.attr("x", "" + (chartController.innerWidth() / 2)).attr("dy", "2.5em").attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'top') {
            return label.attr("x", "" + (chartController.innerWidth() / 2)).attr("dy", "-1.5em").attr("style", "text-anchor: middle;");
          } else if (options.orientation === 'left') {
            return label.attr("dy", "-2.5em").attr("x", "-" + (chartController.innerHeight() / 2)).attr("style", "text-anchor: middle;").attr("transform", "rotate(-90)");
          } else if (options.orientation === 'right') {
            return label.attr("dy", "-2.5em").attr("x", "" + (chartController.innerHeight() / 2)).attr("style", "text-anchor: middle;").attr("transform", "rotate(90)");
          }
        };
        label = axis.append("text").attr("class", "axis-label").text(options.label);
        return positionLabel(label);
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
        var chart, draw, height, options, width, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        chart = chartController.getChart();
        height = chartController.innerHeight();
        width = options.width;
        draw = function(data, old, scope) {
          var bars;
          if (data == null) {
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
        return scope.$watch(attrs.data, draw, true);
      }
    };
  });

}).call(this);

//@ sourceMappingURL=chart.map
(function() {
  angular.module('ad3').directive('d3Chart', function() {
    var defaults;
    defaults = function() {
      return {
        width: '100%',
        height: '480'
      };
    };
    return {
      restrict: 'EA',
      controller: [
        '$scope', '$element', '$attrs', function(scope, el, attrs) {
          var chart, margin, options, scales, svg;
          options = angular.extend(defaults(), attrs);
          margin = {
            top: 40,
            right: 60,
            bottom: 40,
            left: 60
          };
          svg = d3.select(el[0]).append('svg').attr('class', "d3").attr("width", options.width).attr("height", options.height);
          chart = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          this.width = function() {
            return svg[0][0].offsetWidth;
          };
          this.height = function() {
            return svg[0][0].offsetHeight;
          };
          this.innerWidth = function() {
            return this.width() - margin.left - margin.right;
          };
          this.innerHeight = function() {
            return this.height() - margin.top - margin.bottom;
          };
          this.getChart = function() {
            return chart;
          };
          scales = {};
          this.addScale = function(name, scale) {
            return scales[name] = scale;
          };
          this.getScale = function(name) {
            return scales[name];
          };
        }
      ]
    };
  });

}).call(this);

//@ sourceMappingURL=data.map
(function() {
  angular.module('ad3').directive('d3Data', function() {
    return {
      restrict: 'E',
      controller: [
        '$scope', '$attrs', 'd3Service', function(scope, attrs, d3) {
          var binding, src;
          src = attrs.src;
          binding = attrs.data;
          return scope[binding] = d3.csv(src, attrs.columns.split(','));
        }
      ]
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
        var draw, height, line, lineStart, options, x, y;
        options = angular.extend(defaults(), attrs);
        x = chartController.getScale(options.xscale || options.x);
        y = chartController.getScale(options.yscale || options.y);
        height = chartController.innerHeight();
        lineStart = d3.svg.line().x(function(d) {
          return x(d[options.x]);
        }).y(height);
        line = d3.svg.line().x(function(d) {
          return x(d[options.x]);
        }).y(function(d) {
          return y(d[options.y]);
        });
        draw = function(data, old, scope) {
          if (data == null) {
            return;
          }
          return chartController.getChart().append("path").attr("class", "line").datum(data).attr("d", lineStart).transition().duration(500).attr("d", line);
        };
        return scope.$watch(attrs.data, draw, true);
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
        labelRadius: 0.7
      };
    };
    return {
      restrict: 'E',
      require: '^d3Chart',
      link: function(scope, el, attrs, chartController) {
        var arc, center, chart, draw, height, innerRadius, labelArc, labelRadius, options, pie, radius, width;
        options = angular.extend(defaults(), attrs);
        chart = chartController.getChart();
        height = chartController.innerHeight();
        width = chartController.innerWidth();
        innerRadius = parseFloat(options.innerRadius);
        labelRadius = parseFloat(options.labelRadius);
        radius = Math.min(width, height) / 2;
        arc = d3.svg.arc().outerRadius(radius).innerRadius(radius * innerRadius);
        labelArc = d3.svg.arc().outerRadius(radius * labelRadius).innerRadius(radius * labelRadius);
        pie = d3.layout.pie().sort(null).value(function(d) {
          return d[options.amount];
        });
        width = chartController.innerWidth();
        height = chartController.innerHeight();
        center = chartController.getChart().append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        draw = function(data, old, scope) {
          var datum, g, reversedDataMap, _fn, _i, _len;
          if (data == null) {
            return;
          }
          reversedDataMap = {};
          _fn = function(datum) {
            return reversedDataMap[datum[options.amount]] = datum[options.value];
          };
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            _fn(datum);
          }
          g = center.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", function(d, i) {
            return "arc arc-" + i;
          });
          g.append("path").attr("d", arc);
          return g.append("text").attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + ")";
          }).attr("dy", "0.35em").style("text-anchor", "middle").text(function(d) {
            return reversedDataMap[d.value];
          });
        };
        return scope.$watch(attrs.data, draw, true);
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
