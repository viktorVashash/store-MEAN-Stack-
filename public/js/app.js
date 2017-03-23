'use strict';

var app = angular.module('appMain', [
  'ngRoute',
  'User',
  'Main',
  'ListView']);

app.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/main/mainPage.html',
                controller: 'main'
            })
            .when('/product', {
                templateUrl: 'templates/products/list.html',
                controller: 'ListViewController'
            })
            .when('/product/:id', {
                templateUrl: 'templates/products/detail.html',
                controller: 'DetailViewController'
            })
            .when('/login', {
                templateUrl: '../templates/login/login.html',
                controller: 'UserController'
            })
            .when('/logout', {
              templateUrl: 'templates/main/mainPage.html'
            })
            .when('/basket/:id', {
              templateUrl: 'templates/user/basket.html',
              controller: 'BasketCtrl'
            })
            .otherwise('/')
    }
]);
