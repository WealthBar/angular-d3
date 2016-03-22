d3 = require('d3')
localeDefinitions = require('../locale')

angular.module('ad3').service 'd3locale', [ ->
  @getD3Locale = (locale = false) ->
    if locale
      d3.locale(localeDefinitions[locale.toLowerCase()])
    else
      # Default to American English
      d3.locale(localeDefinitions["en-us"])

  @
]
