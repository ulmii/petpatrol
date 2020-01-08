'use strict';

angular.module('petPatrolApp')
    .factory('autoCompleteDataService', ['$http', function ($http) {
        return {
            search: function (country) {
                return $http.get("/autocomplete?country=" + country).then(function (response) {
                    return response.data;
                });
            }
        }
    }]);
