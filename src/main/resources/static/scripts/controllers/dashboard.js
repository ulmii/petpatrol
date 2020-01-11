'use strict';
angular.module('petPatrolApp')
    .controller('DashboardCtrl', ['$scope', '$rootScope', '$http', 'eventDataService', function ($scope, $rootScope, $http, eventDataService) {
        $scope.events = null;
        $scope.selectedEvent = null;

        $scope.selectEvent = function (event) {
          if(event.status === 'NEW') {
            $scope.selectedEvent = event;
          }
        };

        $scope.selectCategory = function (category) {
          eventDataService.search(category).then(function (autocompleteResults) {
            $scope.events = autocompleteResults;
            $scope.selectedEvent = null;
          });
        };

        $scope.getUserEvents = function () {
          $http.get("/users/" + 1 + "/events").then(function (response) {
            $scope.events = response.data;
            $scope.selectedEvent = null;
          });
        };

        $scope.acceptEvent = function (id) {
          $http.get("users/" + 1 + " /events/" + id +"/accept").then(function (response) {
            window.location.href = "dashboard.html";
          });
        };
    }]);
