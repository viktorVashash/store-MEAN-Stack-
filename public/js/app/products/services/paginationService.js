'use strict';

Products.service('pagination', function($sce) {
  var currentPage = 0;
  var itemsPerPage = 4;
  var products = [];

  return {
    setProducts: function(newProducts) {
      products = newProducts;
    },
    getProducts: function(numPage) {
      var num = angular.isUndefined(numPage) ? 0 : numPage;
      var first = itemsPerPage * num;
      var last = first + itemsPerPage;
      currentPage = num;
      last = last > products.length ? (products.length - 1) : last;
      return products.slice(first, last);
    },
    getTotalPagesNum: function() {
      return Math.ceil(products.length/itemsPerPage);
    },
    getPaginationList: function() {
      var pagesNum = this.getTotalPagesNum();
      var paginationList = [];
      paginationList.push({
        name: $sce.trustAsHtml('&laquo;'),
        link: 'prev'
      });

      for(var i = 0; i < pagesNum; i++) {
        var name = i + 1;
        paginationList.push({
          name: $sce.trustAsHtml(String(name)),
          link: i
        });
      };

      paginationList.push({
        name: $sce.trustAsHtml('&raquo;'),
        link: 'next'
      });

      if(pagesNum > 1) {
        return paginationList;
      } else {
        return false;
      }
    },
    getCurrentPageNum: function() {
      return currentPage;
    },
    getPrevPageProducts: function() {
      var prevPageNum = currentPage - 1;
      if(prevPageNum < 0) {
        prevPageNum = 0;
      }

      return this.getProducts(prevPageNum);
    },
    getNextPageProducts: function() {
      var nextPageNum = currentPage + 1;
      var pagesnum = this.getTotalPagesNum();
      if(nextPageNum >= pagesnum) {
        nextPageNum = pagesnum;
      }

      return this.getProducts(nextPageNum);
    }
  };
});
