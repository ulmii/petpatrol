'use strict';

angular.module('petPatrolApp')
    .factory('eventDataService', ['$http', function ($http) {
        return {
            search: function (type) {
                return $http.get("/events?type=" + type).then(function (response) {
                    return response.data;
                });
            }
        }
    }]);
