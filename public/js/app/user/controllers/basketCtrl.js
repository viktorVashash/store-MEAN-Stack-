'use strict';

User.controller('BasketCtrl', [
  '$scope',
  '$http',
  '$routeParams',
  function($scope, $http, $routeParams) {
    $http.get('/user/' + $routeParams.id).success(function(data) {
      console.log(data);
      $scope.user = data;
    }).error(function(err) {
      console.log(err);
    })

    $scope.remove = function(user, id) {
      console.log('/user/remove/' + user);
        console.log('/use  ' + id);
      $http.delete('/user/remove/' + user, {product: id}).success(function(data) {
        console.log(data);
      }).error(function(err) {
        console.log(err);
      });
    }
  }
]);
