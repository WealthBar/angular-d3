angular = require('angular')
angular.module('angularD3App', ['ad3']).
config(['d3localeProvider', (d3localeProvider) ->
  d3localeProvider.setLocales({
    "en-us": require('../../angularD3/locale/en-US'),
    "fr-ca": require('../../angularD3/locale/fr-CA'),
    "zh-cn": require('../../angularD3/locale/zh-CN'),
  })
]).
run(['d3locale', '$location', (d3locale, $location) ->
  lang = $location.search().locale || "en-US"
  $('html').attr('lang', lang)
  d3locale.setLang(lang)
])
require('./main')
