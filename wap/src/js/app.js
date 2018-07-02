
/**
 * Created by Administrator on 2017/03/07.
 */

angular.module('App',['ui.router','rem','App.newsCtrcontrollers','wordCloud',
    'App.services','App.filter', 'ngResource','App.wordControllers','App.myCtrcontrollers',

])
    .config(['$stateProvider','$urlRouterProvider',
        function ($stateProvider,$urlRouterProvider) {
            $urlRouterProvider.otherwise('/class');
            $stateProvider
                .state('class',{
                    url:'/class',
                    templateUrl:'/partials/news.html',
                    controller: 'newsCtr',
                })
                .state('bgy', {
                    url: '/bgy:id',
                    templateUrl: '/partials/1.html',
                    controller: 'detailCtr'
                })
                .state('word', {
                    url: '/word',
                    templateUrl: '/partials/word.html',
                    controller: 'wordCtr'
                })
                .state('attention', {
                    // resolve: {
                    //     data: function (Column, $stateParams) {
                    //         return Column.get({id: $stateParams.id}).$promise;
                    //     }
                    // },
                    url: '/attention',
                    templateUrl: '/partials/attention.html',
                    // controller: 'columnIntroduceCtr'
                })
                .state('my', {
                    // resolve: {
                    //     data: function (Column, $stateParams) {
                    //         return Column.get({id: $stateParams.id}).$promise;
                    //     }
                    // },
                    url: '/my',
                    templateUrl: '/partials/my.html',
                    controller: 'myCtr'
                })

        }]);