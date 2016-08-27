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
.controller('View1Ctrl', ['$scope', '$rootScope', '$firebaseAuth', 'Auth', 'RouteName', function($scope, $rootScope, $firebaseAuth, Auth, RouteName) {
  $scope.auth = Auth;
  // any time auth state changes, add the user data to scope
   $scope.auth.$onAuthStateChanged(function(firebaseUser) {
     $scope.firebaseUser = firebaseUser;
   });

   $scope.RouteName = '';
   $scope.updateRouteName = function(){
     console.log($scope.RouteName);
     RouteName.setRouteName($scope.RouteName);
     console.log('routename updated to', $scope.RouteName);
   }

    $scope.$watch('RouteName', function (newValue, oldValue) {
      console.log('inside scope watch');
        if (newValue !== oldValue) RouteName.setRouteName(newValue);
    });

}]);
