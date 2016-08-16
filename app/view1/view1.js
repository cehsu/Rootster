'use strict';

angular.module('myApp.view1', ['ngRoute','firebase', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
    return $firebaseAuth();
}])
.controller('View1Ctrl', ['$scope', '$rootScope', '$firebaseAuth', 'Auth', function($scope, $rootScope, $firebaseAuth, Auth) {
  $scope.auth = Auth;
  // any time auth state changes, add the user data to scope
   $scope.auth.$onAuthStateChanged(function(firebaseUser) {
     $scope.firebaseUser = firebaseUser;
   });

}]);
