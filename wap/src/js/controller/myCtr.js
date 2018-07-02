/**
 * Created by Administrator on 2017/03/08.
 */
angular.module('App.myCtrcontrollers',['angular-jqcloud'])
    .controller('myCtr', ['$scope',  '$state','$rootScope','$http',
        function ($scope, $state, $rootScope,$http) {
            $rootScope.state = true;

        }

]);