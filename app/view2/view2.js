'use strict';

angular.module('myApp.view2', ['firebase','ngRoute','ngMaterial', 'myApp.config'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'

  }).when('/view2/:params', {templateUrl: 'view2/view2.html', controller: 'View2Ctrl'});
}])
.controller('View2Ctrl', ['$scope', '$rootScope', '$window', '$timeout', '$route', '$routeParams', '$firebaseRef','$firebaseObject', '$firebaseArray','GOOGLEMAPS_URL', function($scope, $rootScope, $window, $timeout, $route, $routeParams, $firebaseRef, $firebaseObject, $firebaseArray, GOOGLEMAPS_URL) {
$scope.render = true;
var map;
var service;
var myUuid;
var placemarkers = {};
$scope.submit;
$scope.place = {};


  function initMap() {

                var latlng = new google.maps.LatLng(35.7042995, 139.7597564);
                var myOptions = {
                    zoom: 15,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                directionsDisplay.setOptions( { suppressMarkers: true } );
                map = new google.maps.Map(document.getElementById("map"), myOptions);
                directionsDisplay.setMap(map);

                $scope.getRoute = function() {
                  calculateAndDisplayRoute(directionsService, directionsDisplay);
                };

              function calculateAndDisplayRoute(directionsService, directionsDisplay) {
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
                      var lng = markers[myUuid].position.lng();
                      var requestRoute = {
                        origin: new google.maps.LatLng(lat, lng),
                        destination: new google.maps.LatLng(lat, lng),
                        waypoints: waypts,
                        optimizeWaypoints: true,
                        travelMode: 'WALKING'
                      };
                      console.log(requestRoute);
                      directionsService.route(requestRoute, function(response, status) {
                        if (status === 'OK') {
                          console.log('response', response);
                          directionsDisplay.setDirections(response);
                          console.log('yay')
                        } else {
                          window.alert('Directions request failed due to ' + status);
                        }
                      });
                    }
                  }

  $timeout(function(){
    initMap();
  });

  var autocompleteForm = new google.maps.places.Autocomplete(document.getElementById("place"));
  google.maps.event.addListener(autocompleteForm, 'place_changed', function() {
      $scope.place = autocompleteForm.getPlace();
      $scope.$apply();
      console.log('$scope.place.name', $scope.place.name);
      // console.log('place', place);
      var lat = $scope.place.geometry.location.lat();
      var lng = $scope.place.geometry.location.lng();
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

  // Stupid routing
  var mapId = location.hash.replace(/^#!\/view2/, '');
    console.log('mapId', mapId);
    console.log('$routeParams', $routeParams);
  if (!mapId) {
      console.log('in stupid routing');
    mapId = (Math.random() + 1).toString(36).substring(2, 12);
    // var new
    console.log(location.hash);
    console.log(location.mapId);
    console.log('$routeParams', $routeParams);
    location.hash = location.hash + "/" + mapId;

  }

  // Firebase
  // var firebase = new Firebase("https://rootster-665cb.firebaseio.com/");

  var markersRef = firebase.database().ref().child('maps/' + mapId);
  var placesRef = firebase.database().ref().child('places/' + mapId);
    // download the data into a local object
    var syncMarkers = $firebaseObject(markersRef);
    $scope.placesRef = $firebaseArray(placesRef);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncMarkers.$bindTo($scope, "markersRef");
    // syncPlaces.$bindTo($scope, "placesRef");

    // add new items to the array
    // the message is automatically added to our Firebase database!
    $scope.addPlace = function() {
      $scope.placesRef.$add({
        name: $scope.place.name,
        duration: $scope.place.duration
      });
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

    map.panTo(marker.position);
  }

  function removePoint(uuid) {
    markers[uuid].setMap(null);
    markers[uuid] = null;
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
