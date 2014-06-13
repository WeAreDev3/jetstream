var jetstream = angular.module('jetstream', []);

jetstream.controller('chatList', ['$log', function($log){
    this.chats = [{
        users: ['superspecialninja', 'yetanotherid', 'moreuuidsplease'],
        name: 'Dev3',
        id: 'potato',
        timestamp: '2014-06-02T00:57:03.790Z'
    }, {
        users: ['superspecialninja', 'moreuuidsplease'],
        name: '',
        id: 'potato2',
        timestamp: '2014-06-02T00:57:10.790Z'
    }];

    $log.log(this.chats);
}]);

jetstream.directive('chatWindow', function () {
    return {
        restrict: 'E',
        templateUrl: '/ng/chat.html'
    };
});