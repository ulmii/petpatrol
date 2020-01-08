'use strict';

angular.module('petPatrolApp')
    .directive('autoComplete', ['autoCompleteDataService', function (autoCompleteDataService) {
        return {
            restrict: 'A',
            scope: {
                country: '='
            },
            link: function (scope, elem) {
                elem.autocomplete({
                    source: function (searchTerm, response) {
                        autoCompleteDataService.search(searchTerm.term).then(function (autocompleteResults) {
                            response($.map(autocompleteResults, function (autocompleteResult) {
                                return {
                                    value: autocompleteResult
                                }
                            }))
                        });
                    },
                    minLength: 1,
                    select: function (event, selectedItem) {
                        event.stopPropagation();
                        scope.country = selectedItem.item.value;
                        scope.$apply();
                    }
                })
            }
        };
    }]);
