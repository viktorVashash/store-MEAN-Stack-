'use strict';

var Products = angular.module('ListView', []);

Products.controller('ListViewController', [
  '$scope',
  '$http',
  'pagination',
  function ($scope, $http, pagination) {
    $http.get('/product').success(function(data) {
      pagination.setProducts(data)
      $scope.products = pagination.getProducts();
      $scope.paginationList = pagination.getPaginationList();
      console.log($scope)
    }).error(function(err) {
      console.log(err);
    });

    $scope.showPage = function(page) {
      if(page == 'prev') {
        $scope.products = pagination.getPrevPageProducts();
      } else if (page == 'next') {
        $scope.products = pagination.getNextPageProducts();
      } else {
        $scope.products = pagination.getProducts(page)
      }
    };

    $scope.currentPageNum = function() {
      return pagination.getCurrentPageNum();
    };

    $scope.save = function(product) {
      console.log(product.picture);

      $http.post('/product/', product).success(function(data) {
        pagination.setProducts(data)
        $scope.products = data;
        $scope.paginationList = pagination.getPaginationList();
      }).error(function(err) {
        console.log(err);
      });
    }
  }
]);

Products.controller('DetailViewController', [
    '$scope',
    '$http',
    '$routeParams',
    function ($scope, $http, $routeParams) {
      var id = $routeParams.id;
      $scope.data = {
          changed: false
        };

      $http.get('/product/' + id).success(function(data) {
        $scope.product = data;
      });

      $scope.changeProduct = function() {
        $scope.changed = true;
      };

      $scope.cancel = function() {
        $scope.changed = false;
      };

      $scope.deleteProduct = function(product) {
        $http.delete('/product/' + product._id).success(function() {

        });
      };

      $scope.saveProduct = function(product) {
        product.title = $scope.product.changedProduct;
        $http.patch('/product/' + product._id, product).success(function() {

        }).error(function(err){
          console.log(err);
        });
      }

      $scope.addToBasket = function(userID, productID) {
        $http.patch('/user/to_basket/' + userID, {product: productID}).success(function() {
          console.log("ADDED")
        }).error(function(err) {
          console.log(err);
        });
      }
    }
]);
