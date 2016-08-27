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
config(['$locationProvider', '$routeProvider', '$firebaseRefProvider', 'FIREBASE_URL', 'FIREBASE_AUTHDOMAIN', 'FIREBASE_APIKEY', '$mdThemingProvider', function($locationProvider, $routeProvider, $firebaseRefProvider, FIREBASE_URL, FIREBASE_AUTHDOMAIN, FIREBASE_APIKEY, $mdThemingProvider) {
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
  var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
  'contrastDefaultColor': 'light',
  'contrastDarkColors': ['50'],
  '50': 'ffffff'
});
$mdThemingProvider.definePalette('customBlue', customBlueMap);
$mdThemingProvider.theme('default')
  .primaryPalette('customBlue', {
    'default': '500',
    'hue-1': '50'
  })
  .accentPalette('pink');
$mdThemingProvider.theme('input', 'default')
      .primaryPalette('grey')
}]).
factory('RouteName', function () {

    var data = {
        RouteName: ''
    };

    return {
        getRouteName: function () {
            return data.RouteName;
        },
        setRouteName: function (customName) {
            data.RouteName = customName;
        }
    };
});;
