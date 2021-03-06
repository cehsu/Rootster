'use strict';

angular.module('myApp.view2', ['firebase','ngRoute','ngMaterial', 'myApp.config'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'

  }).when('/view2/:params', {templateUrl: 'view2/view2.html', controller: 'View2Ctrl'});
}])
.controller('View2Ctrl', ['$scope', '$rootScope', '$window', '$timeout', '$route', '$routeParams', '$firebaseRef','$firebaseObject', '$firebaseArray','GOOGLEMAPS_URL','$mdToast', 'RouteName', function($scope, $rootScope, $window, $timeout, $route, $routeParams, $firebaseRef, $firebaseObject, $firebaseArray, GOOGLEMAPS_URL, $mdToast, RouteName) {
$scope.render = true;
// Custom routing
var mapId = location.hash.replace(/^#!\/view2/, '');
  console.log('mapId', mapId);
  console.log('$routeParams', $routeParams);
if (!mapId) {
    console.log('in stupid routing');
  mapId = RouteName.getRouteName() || (Math.random() + 1).toString(36).substring(2, 12);
  // var new
  console.log(location.hash);
  console.log(location.mapId);
  console.log('mapId');
  console.log(mapId);
  console.log('$routeParams', $routeParams);
  location.hash = location.hash + "/" + mapId;

};
var map;
var service;
var myUuid;
var placemarkers = {};
$scope.submit;
$scope.place = {};
$scope.markerLoading;
$scope.$watch(function () { return RouteName.getRouteName(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.RouteName = newValue;
    });

var markersRef = firebase.database().ref().child('maps/' + mapId);
var placesRef = firebase.database().ref().child('places/' + mapId);
  // download the data into a local object
  var syncMarkers = $firebaseObject(markersRef);
  $scope.placesRef = $firebaseArray(placesRef);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  syncMarkers.$bindTo($scope, "markersRef");
  // syncPlaces.$bindTo($scope, "placesRef");



  function initMap() {
    //create map
                var latlng = new google.maps.LatLng(35.7042995, 139.7597564);
                var myOptions = {
                    zoom: 15,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var directionsService = new google.maps.DirectionsService;
                $scope.directionsDisplay = new google.maps.DirectionsRenderer;
                $scope.directionsDisplay.setOptions( { suppressMarkers: true } );
                map = new google.maps.Map(document.getElementById("map"), myOptions);
                $scope.directionsDisplay.setMap(map);
    //populate map with existing todo markers
    $scope.markerLoading = function(){
    console.log('marker preloading');
    console.log('$scope.placesRef');
    console.log($scope.placesRef);
    console.log('$scope.placesRef.length');
    console.log($scope.placesRef.length);
    for(var markerpin in placemarkers){
      var included = false;
      var looprun = false;
      $scope.placesRef.$loaded()
      .then(function(data){
        looprun = true;
                  angular.forEach(data, function(markerPlace, i){
                  if(markerPlace.name === markerpin.name){
                    included = true;
                  }
                // var stringnow = JSON.stringify($scope.placesRef[todo.name]);
                //     console.log('marker created', stringnow);
              });
            });
        if(!included || !looprun){
          //remove old markers
          placemarkers[markerpin].setMap(null);
          $scope.resetRoute();
        }
    }
    $scope.placesRef.$loaded()
    .then(function(data){
                angular.forEach(data, function(markerPlace, i){
                  console.log('marker preloading number', i);
                  console.log(markerPlace);
                  var infowindow = new google.maps.InfoWindow({
                      content: markerPlace.name
                    });
                    console.log(markerPlace.lat);
                    var latnow = +markerPlace.lat;
                    console.log(latnow);
                    console.log(markerPlace.lng);
                    var lngnow = +markerPlace.lng;
                    console.log(lngnow);
                  placemarkers[markerPlace.name] = new google.maps.Marker({
                      position: new google.maps.LatLng(latnow, lngnow),
                      map: map,
                      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                  });
    // $scope.place = place;
                  placemarkers[markerPlace.name].addListener('click', function() {
                infowindow.open(map, placemarkers[markerPlace.name]);
              });
              // var stringnow = JSON.stringify($scope.placesRef[todo.name]);
              //     console.log('marker created', stringnow);
            });
          });
              }
              $scope.markerLoading();
    //create routing function
                $scope.getRoute = function() {
                  //check for conflicts
                  calculateAndDisplayRoute(directionsService, $scope.directionsDisplay);
                };
                $scope.resetRoute = function(){
                  $scope.directionsDisplay.setDirections({routes: []});
                };

              function calculateAndDisplayRoute(service, display) {
                      var waypts = [];
                      var waypointArray = placemarkers;
                      console.log('placemarkers', placemarkers);
                      console.log('waypointArray', waypointArray);
                      for (var waypoint in waypointArray) {
                        var lat = waypointArray[waypoint].position.lat();
                        var lng = waypointArray[waypoint].position.lng();
                        console.log("pushing", lat, lng);
                          waypts.push({
                            location: new google.maps.LatLng(lat, lng),
                            stopover: true
                          });
                      }
                      console.log('waypts', waypts);
                      var lat = markers[myUuid].position.lat();
                      console.log('lat', lat);
                      var lng = markers[myUuid].position.lng();
                      console.log('lng', lng);
                      var requestRoute = {
                        origin: new google.maps.LatLng(lat, lng),
                        destination: new google.maps.LatLng(lat, lng),
                        waypoints: waypts,
                        optimizeWaypoints: true,
                        travelMode: 'WALKING'
                      };
                      console.log(requestRoute);
                      service.route(requestRoute, function(response, status) {
                        if (status === 'OK') {
                          console.log('response', response);
                          display.setDirections(response);
                          console.log('yay')
                        } else {
                          window.alert('Directions request failed due to ' + status);
                        }
                      });
                    }
                    $scope.autocompleteForm = new google.maps.places.Autocomplete(document.getElementById("place"));
                    google.maps.event.addListener($scope.autocompleteForm, 'place_changed', function() {
                      console.log('autocompleteform place changed');
                        $scope.place = $scope.autocompleteForm.getPlace();
                        $scope.$apply();
                        if(!$scope.place.opening_hours.open_now){
                          console.log('toast should show');
                          $mdToast.show(
                            $mdToast.simple('Oops! That business does not appear to be open at the moment.')
                            .position('left bottom')
                            .hideDelay(3000)
                          );
                        }

                    });
                  }

  $timeout(function(){
    initMap();
  });



  angular.element($window).on('resize', function () {
      console.log("resizing");
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center);
		});

  // Utilities
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  // Get current UUID
  var myUuid = localStorage.getItem('myUuid');
  if (!myUuid) {
    myUuid = guid();
    localStorage.setItem('myUuid', myUuid);
  }


// //   $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };



  // Firebase
  // var firebase = new Firebase("https://rootster-665cb.firebaseio.com/");

  // var markersRef = firebase.database().ref().child('maps/' + mapId);
  // var placesRef = firebase.database().ref().child('places/' + mapId);
  //   // download the data into a local object
  //   var syncMarkers = $firebaseObject(markersRef);
  //   $scope.placesRef = $firebaseArray(placesRef);
  //   // synchronize the object with a three-way data binding
  //   // click on `index.html` above to see it used in the DOM!
  //   syncMarkers.$bindTo($scope, "markersRef");
  //   // syncPlaces.$bindTo($scope, "placesRef");

    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.removePlace = function(placetoRemove){
      // placemarkers[placetoRemove.name].setMap(null);
      $scope.placesRef.$remove(placetoRemove);
      $scope.markerLoading();
      $scope.resetRoute();
      console.log('placetoRemove.name', placetoRemove.name);
    }

    $scope.addPlace = function() {
      console.log('$scope.place.name', $scope.place.name);
      // console.log('place', place);
      var lat = $scope.place.lat = $scope.place.geometry.location.lat();
      var lng = $scope.place.lng = $scope.place.geometry.location.lng();
      console.log('lat', lat);
      console.log('lng', lng);

      var infowindow = new google.maps.InfoWindow({
          content: $scope.place.name
        });
      placemarkers[$scope.place.name] = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      // $scope.place = place;
      placemarkers[$scope.place.name].addListener('click', function() {
    infowindow.open(map, placemarkers[$scope.place.name]);
  });
      console.log('marker created', placemarkers[$scope.place.name]);
      $scope.placesRef.$add({
        name: $scope.place.name,
        // duration: $scope.place.duration,
        open: $scope.place.opening_hours.open_now,
        address: $scope.place.formatted_address,
        lat: $scope.place.geometry.location.lat(),
        lng: $scope.place.geometry.location.lng()
      });
      $scope.markerLoading();
    console.log('errands updated');
    };

  var markers = {};
  var places = {};
  var marker;

  function addPoint(uuid, position) {
    console.log(position.coords);
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        flat: true,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    markers[uuid] = marker;
    console.log(marker);
    map.panTo(marker.position);
  }

  function removePoint(uuid) {
    markers[uuid].setMap(null);
  }

  function updatePoint(uuid, position) {
    var marker = markers[uuid]
    marker.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  }

  function putPoint(uuid, position) {
    if (markers[uuid])
      updatePoint(uuid, position)
    else
      addPoint(uuid, position)
  }

  var watchPositionId;

  function successCoords(position) {
    if (!position.coords) return

    markersRef.child(myUuid).set({
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      timestamp: Math.floor(Date.now() / 1000)
    })

    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude))
  }

  function errorCoords() {
    console.log('Unable to get current position')
  }

  var geo_options = {
  enableHighAccuracy: true,

};

  watchPositionId = navigator.geolocation.watchPosition(successCoords, errorCoords, geo_options);

//   var unwatch = obj.$watch(function() {
//   console.log("data changed!");
// });
//
// // at some time in the future, we can unregister using
// unwatch();
  markersRef.on('child_added', function(childSnapshot) {
    var uuid = childSnapshot.key
    var position = childSnapshot.val()

    addPoint(uuid, position)
  })

  markersRef.on('child_changed', function(childSnapshot) {
    var uuid = childSnapshot.key
    var position = childSnapshot.val()

    putPoint(uuid, position)
  })

  markersRef.on('child_removed', function(oldChildSnapshot) {
    var uuid = oldChildSnapshot.key

    removePoint(uuid)
  })

  $scope.placesRef.$watch(function(event) {
    $scope.markerLoading();
  console.log('errands updated', event);
});

  // Remove old markers
  setInterval(function() {
    markersRef.limitToFirst(100).once('value', function(snap) {
      var now = Math.floor(Date.now() / 1000)

      snap.forEach(function(childSnapshot) {
        var uuid = childSnapshot.key
        if (childSnapshot.val().timestamp < now - 60 * 30) {
          markersRef.child(uuid).set(null)
          markers[uuid] = null
        }
      })
    })
  }, 5000);
}]);
