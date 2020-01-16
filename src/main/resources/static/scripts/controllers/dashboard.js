'use strict';
angular.module('petPatrolApp')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$http', 'eventDataService', function ($scope, $rootScope, $http, eventDataService) {
    let backupEvents = null;
    $scope.events = null;
    $scope.selectedEvent = null;
    $scope.selectedCategory = 'new';
    $scope.searchTerm = null;
    $scope.categoryMap = {
      new: 'Nowe',
      mine: "Moje",
      done: "Zamknięte",
      rejected: "Odrzucone"
    };

    $scope.search = function () {
      $scope.events = backupEvents.filter(event =>
        (event.title ? event.title.toLowerCase()
          .includes($scope.searchTerm.toLowerCase()) : false)
        || (event.location ? event.location.toLowerCase()
          .includes($scope.searchTerm.toLowerCase()) : false)
        || (event.description ? event.description.toLowerCase()
          .includes($scope.searchTerm.toLowerCase()) : false));
    };

    $scope.selectEvent = function (event) {
      if (event.status === 'NEW') {
        $scope.selectedEvent = event;
      }
    };

    $scope.selectCategory = function (category) {
      $scope.selectedCategory = $scope.categoryMap[category];
      eventDataService.search(category)
        .then(function (autocompleteResults) {
          $scope.events = autocompleteResults;
          backupEvents = autocompleteResults;
          $scope.selectedEvent = null;
        });
    };

    $scope.getUserEvents = function () {
      $scope.selectedCategory = $scope.categoryMap['mine'];
      $http.get("/users/" + 1 + "/events")
        .then(function (response) {
          $scope.events = response.data;
          backupEvents = response.data;
          $scope.selectedEvent = null;
        });
    };

    $scope.acceptEvent = function (id) {
      $http.get("users/" + 1 + " /events/" + id + "/accept")
        .then(function (response) {
          window.location.href = "dashboard.html";
        });
    };
  }]);
