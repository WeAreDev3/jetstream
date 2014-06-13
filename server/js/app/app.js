var jetstream = angular.module('jetstream', []);

jetstream.directive('chatWindow', function () {
    return {
        restrict: 'E',
        templateUrl: 'chat.html'
    };
});