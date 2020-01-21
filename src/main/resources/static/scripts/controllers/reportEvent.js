'use strict';

angular.module('petPatrolApp')
  .controller('reportEventCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    $scope.title = null;
    $scope.location = null;
    $scope.optradio = "yes";
    $scope.email = null;
    $scope.description = null;
    $scope.coordinates = {
      lat: null,
      lng: null
    };
    let id = null;

    $scope.init = function () {
      $http.get("/getEventId").then(function (response) {
        id = response.data;
        console.log(id);
      });


      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        document.innerHTML = "Geolocation is not supported by this browser.";
      }

      function showPosition(position) {
        setPosition(position.coords.latitude, position.coords.longitude);
      }
    };

    function setPosition(lat, lon) {
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyCaYeCmNWNFLv9XVeOYvCY4k4jLA7Gwa-Y").then(function (response) {
        $scope.location = response.data.results[0].formatted_address;
        $scope.coordinates.lat = lat;
        $scope.coordinates.lng = lon;
        initAutocomplete();
      });
    }

    $scope.showMaps = function () {
      $("#mapModal").modal('toggle');
    };

    $scope.uploadEvent = function () {
      let alerts = [];
      console.log($scope.title);
      if (isBlank($scope.title)) {
        alerts.push("tytuł");
      }
      if (isBlank($scope.location)) {
        alerts.push("lokalizacje");
      }
      if (isBlank($scope.description)) {
        alerts.push("opis");
      }
      if (isBlank($scope.email) && $scope.optradio === 'yes') {
        alerts.push("email");
      }
      if (filesToUpload.length <= 0) {
        alerts.push("zdjecia");
      }
      if (alerts.length > 0) {
        alert("Dodaj: " + alerts.join(", ") + "!");
        return;
      }

      uploadFiles();
      let data = {
        id: id,
        title: $scope.title,
        location: $scope.location,
        description: $scope.description,
        email: $scope.email,
        pictures: pictures
      };

      setTimeout(function () {
        console.log(data);
        $http.post("/events", data).then(function (response) {
          if (response.status === 200) {
            $("#successModal").modal('toggle');
          } else {
            $("#failureModal").modal('toggle');
          }
        }).catch((err) => {
          console.error('An error occurred:', err.error);
          $("#failureModal").modal('toggle');
        });
      }, 2000);
    }
  }]);
