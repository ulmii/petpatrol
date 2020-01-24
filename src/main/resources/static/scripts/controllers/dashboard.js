'use strict';
angular.module('petPatrolApp')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$http', 'eventDataService', function ($scope, $rootScope, $http, eventDataService) {
    let backupEvents = null;
    $scope.events = null;
    $scope.selectedEvent = null;
    $scope.selectedCategory = 'new';
    $scope.searchTerm = null;
    $scope.statusMap = {
      "NEW": 'Nowe',
      "REJECTED": 'Odrzucone',
      "DONE": 'Zakończone',
      "TAKEN": 'Przyjęte'
    };
    $scope.categoryMap = {
      new: 'Nowe',
      mine: "Moje",
      done: "Zamknięte",
      rejected: "Odrzucone"
    };
    $scope.reverseCategoryMap = {
      Nowe: 'new',
      Moje: "mine",
      Zamknięte: "done",
      Odrzucone: "rejected"
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
        $scope.selectedEvent = event;
    };

    $scope.selectCategory = function (category) {
      if(category === 'mine') {
        $scope.getUserEvents()
      } else {
        $scope.selectedCategory = $scope.categoryMap[category];
        eventDataService.search(category)
          .then(function (eventResults) {
            $scope.events = eventResults;
            backupEvents = eventResults;
            $scope.selectedEvent = null;
          });
      }
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
      $http.post("users/" + 1 + " /events/" + id + "/accept", null)
        .then(function (response) {
          $scope.selectCategory($scope.reverseCategoryMap[$scope.selectedCategory]);
        });
    };

    $scope.rejectEvent = function (id) {
      $http.post("users/" + 1 + " /events/" + id + "/reject", null)
        .then(function (response) {
          $scope.selectCategory($scope.reverseCategoryMap[$scope.selectedCategory]);
        });
    };

    $scope.resetEvent = function (id) {
      $http.post("users/" + 1 + " /events/" + id + "/reset", null)
        .then(function (response) {
          $scope.selectCategory($scope.reverseCategoryMap[$scope.selectedCategory]);
        });
    };

    $scope.completeEvent = function (id) {
      $http.post("users/" + 1 + " /events/" + id + "/complete", null)
        .then(function (response) {
          $scope.selectCategory($scope.reverseCategoryMap[$scope.selectedCategory]);
          if($scope.selectedEvent.email) {
            $("#completeModal").modal('toggle');
          }
        });
    };

    $scope.isImmutable = function() {
      return $scope.selectedCategory !== 'new' || $scope.selectedCategory === 'rejected' || $scope.selectedCategory === 'done';
    };
  }]);
