/**
 * Created by Administrator on 2017/03/08.
 */
angular.module('App.newsCtrcontrollers',['angular-jqcloud'])
    .controller('newsCtr', ['$scope',  '$state','$rootScope','$http',
        function ($scope, $state, $rootScope,$http) {
            $rootScope.state=true;
            $scope.showLogoDetail= function () {
              $rootScope.state=false;
            };
            $rootScope.isActive = 1;
            $rootScope.bar = function (index) {
                    $rootScope.isActive = index;
            }

            $http.get('json/data.json').then(function(res){
                  console.log(res);
                  $scope.data = res.data;
                $scope.logos =   $scope.data.logos.news;
                $scope.lists =   $scope.data.list.newsList;
            });

            $scope.isActive= 1;
            $scope.tabs = function (index) {
                $scope.isActive= index;
                if(index==0){

                }else  if(index==1){
                    $scope.logos =   $scope.data.logos.news;
                    $scope.lists =   $scope.data.list.newsList;
                }else  if(index==2){
                    $scope.logos =   $scope.data.logos.estate;
                    $scope.lists =   $scope.data.list.estateList;
                }else  if(index==3){
                    $scope.logos =   $scope.data.logos.science;
                    $scope.lists =   $scope.data.list.scienceList;

                }else  if(index==4){
                    $scope.logos =   $scope.data.logos.it;
                    $scope.lists =   $scope.data.list.itList;
                }
            }
        }

])
    .controller('detailCtr', ['$scope',  '$state','$rootScope','$stateParams',
        function ($scope, $state, $rootScope,$stateParams) {
        console.log($stateParams)
        // $rootScope.state=true;
        // $scope.showWordDetail= function () {
            $rootScope.state=false;
        // }

         $scope.colors = ['#ef473a'];//热词颜色配置
        $scope.words = [
            {text:'物业差',link:'#/word',style:{
                top:2.82+'rem',left:3.63+'rem',width:1+'rem',height:1+'rem',lineHeight:1+'rem',backgroundColor:'#e9375d'
            }},
            {text:'生态社区',link:'#/word',style:{
                top:1.59+'rem',left:2.24+'rem',width:1.6+'rem',height:1.6+'rem',lineHeight:1.6+'rem',backgroundColor:'#00b17d'
            }},
            {text:'暴涨',link:'#/word',style:{
                top:.41+'rem',left:.37+'rem',width:1.2+'rem',height:1.2+'rem',lineHeight:1.2+'rem',backgroundColor:'#00b17d'
            }},
            {text:'维权',link:'#/word',style:{
                top:.3+'rem',left:2.09+'rem',width:1+'rem',height:1+'rem',lineHeight:1+'rem',backgroundColor:'#e9375d'
            }},
            {text:'退房',link:'#/word',style:{
                top:2.45+'rem',left:1.00+'rem',width:1.3+'rem',height:1.3+'rem',lineHeight:1.3+'rem',backgroundColor:'#e9375d'
            }},
            {text:'广东百强',link:'#/word',style:{
                top:.3+'rem',left:4.9+'rem',width:1.8+'rem',height:1.8+'rem',lineHeight:1.8+'rem',backgroundColor:'#00b17d'
            }},
            {text:'广东省',link:'#/word',style:{
                top:2.3+'rem',left:4.52+'rem',width:0.8+'rem',height:.8+'rem',lineHeight:.8+'rem',backgroundColor:'#b4b4b4'
            }},
            {text:'五十强',link:'#/word',style:{
                top:0.1+'rem',left:3.4+'rem',width:1+'rem',height:1+'rem',lineHeight:1+'rem',backgroundColor:'#00b17d'
            }},
            {text:'拿地',link:'#/word',style:{
                top:2.3+'rem',left:5.54+'rem',width:1.3+'rem',height:1.3+'rem',lineHeight:1.3+'rem',backgroundColor:'#00b17d'
            }},
            {text:'森林城市',link:'#/word',style:{
                top:1.7+'rem',left:0.2+'rem',width:1+'rem',height:1+'rem',lineHeight:1+'rem',backgroundColor:'#00b17d'
            }}
        ]

            $scope.showWord = function (id) {
            console.log(id);
                $state.go(id);
            }
    }

]);;