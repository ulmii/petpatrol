'use strict';

angular.module('petPatrolApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$window', '$timeout', function ($scope, $rootScope, $http, $window, $timeout) {
        $scope.checkCredentials = function () {
            console.log('dsfsdf');
            console.log($scope.email, $scope.password);
            if($scope.email === 'ratownik@petpatrol.com' && $scope.password === 'ratownik123') {
                window.location.href = "dashboard.html";
            }
        };
    }]);
