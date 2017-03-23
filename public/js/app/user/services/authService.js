'use strict';

User.service('checkAuth', function($http) {
  return $http.get('/authenticated');
});
