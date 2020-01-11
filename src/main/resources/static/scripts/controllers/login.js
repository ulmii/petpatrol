'use strict';

angular.module('petPatrolApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.isFailed = false;

        $scope.checkCredentials = function () {
            console.log('dsfsdf');
            console.log($scope.email, $scope.password);
            if($scope.email === 'ratownik@petpatrol.com' && $scope.password === 'ratownik123') {
                window.location.href = "dashboard.html";
            } else {
                window.location.search = "error";
            }

        };

        $scope.init = function() {
            if(window.location.search.includes('error')) {
                $scope.isFailed = true;
            }
        };
    }]);
