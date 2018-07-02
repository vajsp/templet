/**
 * Created by Administrator on 2017/03/08.
 */
angular.module('App.wordControllers', [ ])
    .controller('wordCtr', ['$scope','$state','$rootScope',
        function ($scope, $state,$rootScope) {
            // $rootScope.state=true;
            // $scope.showWordDetail= function () {
                $rootScope.state=false;
            // };
            // $scope.goBack  =function () {
            //     $state.go(-1);
            // };
        }

]);