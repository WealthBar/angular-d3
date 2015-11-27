controller = require('./main_controller')
view = require('./main_view.html')

angular.module('angularD3App').directive 'main', ->
  controller: controller
  templateUrl: view
