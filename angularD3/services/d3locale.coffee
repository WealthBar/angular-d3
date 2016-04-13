d3 = require('d3')

# d3Locale
#
# Usage
# module.config(['d3localeProvider', (d3localeProvider) ->
#  d3localeProvider.setLocales({
#    "en-us": require('angularD3/locale/en-US'),
#    "fr-ca": require('angularD3/locale/fr-CA'),
#    "zh-cn": require('angularD3/locale/zh-CN'),
#  })
#]).run(['d3locale', (d3locale) ->
#   d3locale.setLang('en-us')
# ])

angular.module('ad3').provider 'd3locale', ->
  localeDefinitions = {}

  @setLocales = (definitions) ->
    localeDefinitions = definitions

  @$get = ->
    updateLocale = (locale) ->
      d3.format = locale.numberFormat
      d3.time.format = locale.timeFormat

    return {
      setLang: (lang) ->
        try
          locale = d3.locale(localeDefinitions[lang.toLowerCase()])
          updateLocale(locale)
        catch err
          throw "d3locale error: '#{lang}' is a locale that either does not exist, or has not been loaded properly."

      setLocale: (locale) ->
        updateLocale(d3.locale(locale))
    }

  @
