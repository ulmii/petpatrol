'use strict';
angular.module('petPatrolApp')
    .controller('DashboardCtrl', ['$scope', '$rootScope', '$http', '$window', '$timeout', function ($scope, $rootScope, $http) {
        $scope.events = null;
        $scope.selectedEvent = null;

        $scope.init = function() {
            $http.get("/events?type=new").then(function (response) {
                $scope.events = response.data;
                console.log(response.data);
            });
        };

        $scope.selectEvent = function (event) {
          if(event.status === 'NEW') {
            $scope.selectedEvent = event;
          }
        };

        $scope.getUserEvents = function () {
          $http.get("/users/" + 1 + "/events").then(function (response) {
            $scope.events = response.data;
            $scope.selectedEvent = null;
            console.log(response.data);
          });
        };

        $scope.acceptEvent = function (id) {
          $http.get("users/" + 1 + " /events/" + id +"/accept").then(function (response) {
            window.location.href = "dashboard.html";
          });
        };
    }]);
