'use strict';

var User = angular.module('User', []);

User.controller('UserController', [
  '$scope',
  '$http',
  '$location',
  'checkAuth',
  function($scope, $http, $location, checkAuth) {
    checkAuth.success(function(data) {
      $scope.user = data;
    }).error(function(err) {
      $scope.user = null;
    });

    $scope.registration = function(user) {
      $http.post('/user/', user).success(function(user) {
        $scope.user = user;
        console.log($scope.user);
      }).error(function(err) {
        console.log(err);
      })
    }

    $scope.login = function(user) {
      $http.post('/user/login', user).success(function(user) {
        $scope.user = user;
        console.log($scope.user);
        $location.path('/');
      }).error(function(err) {
        console.log(err);
      });
    }

    $scope.logout = function(user) {
      $http.post('/user/logout', user).success(function(user) {
        $scope.user = null;
        console.log($scope.user);
        $location.path('/');
      }).error(function(err) {
        console.log(err);
      });
    }
  }
]);
