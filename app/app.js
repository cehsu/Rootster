'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.config',
  'firebase',
  'ngMaterial',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', '$firebaseRefProvider', 'FIREBASE_URL', 'FIREBASE_AUTHDOMAIN', 'FIREBASE_APIKEY', function($locationProvider, $routeProvider, $firebaseRefProvider, FIREBASE_URL, FIREBASE_AUTHDOMAIN, FIREBASE_APIKEY) {
  var config = {
    apiKey: FIREBASE_APIKEY,
    authDomain: FIREBASE_AUTHDOMAIN,
    databaseURL: FIREBASE_URL
  };

  firebase.initializeApp(config);
  var rootRef = firebase.database().ref();
  $firebaseRefProvider.registerUrl(FIREBASE_URL);


  $locationProvider.hashPrefix('!');
//   $locationProvider.html5Mode({
//   enabled: true,
//   requireBase: false
// });

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
