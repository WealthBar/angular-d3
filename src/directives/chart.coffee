angular.module('ad3').directive 'chart', () ->
  defaults =
    height: 480
    width: 640

  restrict: 'E'

  replace: true

  controller: ['$scope', '$element', '$attrs', (scope, el, attrs) ->
    angular.extend(attrs, defaults)
    margin = { top: 40, right: 60, bottom: 40, left: 60 }
    svg = d3.select(el[0]).append('svg')
      .attr("width", attrs.width)
      .attr("height", attrs.height)
    chart = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    @getChart = () -> chart
    @width = -> attrs.width
    @height = -> attrs.height
    @innerWidth = -> attrs.width - margin.left - margin.right
    @innerHeight = -> attrs.height - margin.top - margin.bottom
  ]

  link: (scope, el, attrs) ->

