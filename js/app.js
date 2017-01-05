(function() {
 var app =  angular.module('app', [
   'components.svg'
 ]);
 // A controller that displays hello world
  app.controller('CanvasCtrl', function() {
     this.message = "Hello, world";
  });
})();