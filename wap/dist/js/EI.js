
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
/**
 * Created by Administrator on 2017/03/13.
 */
angular.module('wordCloud', [])
    .directive('mrcloud',function () {
            return {
                restrict:'E',
                replace:'true',
                // template:'<div width heigth ng-for i in wordcloudArr  ng-click=wordclick(i)></div>',
                template:'<span style="width: {{x}}"></span>',
                scope:{
                    width:'=',
                    heigth:'=',
                    dataSrc:'=',
                    onwordclick:'&'
                },
                controller:function ($scope) {
                    console.log($scope.dataSrc);
                    $scope.$watch('wordclouddata',function (newValue,oldValue) {
                        // $scope.wordcloudArr = datasrc.datafilter($scope.data)
                    });
                    $scope.wordclick =function (i) {
                        $scope.onwordclick({i:i});
                    }
                }
            }
        }
    );
/**
 * Created by Action on 17/4/27.
 */
angular.module('App.filter',[])
    .filter('trustUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });
angular.module('rem',[
])

    .directive('mrRem',['$parse', '$filter', function($parse, $filter){

        return {
            restrict:'A',
            link: function(scope, element, attrs){
                var _size = 100;
                var p = (document.body && document
                    .body.clientWidth || document.getElementsByTagName("html")[0].offsetWidth) / 750;
                _size = p * 100;
                document.getElementsByTagName("html")[0].setAttribute("style", "font-size:" + _size + "px!important");

            }
        };

    }])
    .directive('mrHeight',['$parse', '$filter', function($parse, $filter){

        return {
            restrict:'A',
            link: function(scope, element, attrs){
                var p = window.innerHeight;
                var a=document.getElementsByClassName('bar-header')[0];
                document.getElementById('allmap').setAttribute("style", "height:" +  (p-a.offsetHeight) + "px!important");
            }
        };
    }])
/**
 * Created by Administrator on 2017/03/07.
 */
'use strict';
/* Services */
angular.module('App.services', [])
    .value('version', 'v1.0')
    .factory('Columns', ['$resource', function ($resource) {
        var Columns = $resource('/api/list',{
            //'query': {method: 'GET', isArray: true}
        });
        return Columns;
    }])
    .factory('Live', ['$resource', function ($resource) {
      
        var Live = $resource('/api/live/:id',{id:'@id'},{
            'query': {method: 'GET', isArray: true}
        });
        return Live;
    }])
    .factory('Column', ['$resource', function ($resource) {
      
        var Column = $resource('/api/list/:id', {id: '@id'}, {
            'query': {method: 'GET', isArray: true}
        });
        //   Column.articles = $resource('/api/column/:id/articles', {id: '@id'}, {
        //     'query': {method: 'GET', isArray: true}
        // });
        return Column;
    }])
    .factory('My', ['$resource', function ($resource) {

        var My = $resource('/api/my',{
            // 'query': {method: 'GET', isArray: true}
        });
        return My;
    }])
    .factory('Article', ['$resource', function ($resource) {
      
        var Article = $resource('/api/article/:id', {id: '@id'}, {
            'query': {method: 'GET', isArray: true}
        });
        Article.favorite = $resource('/api/article/:id/fav', {id: '@id'}, {
            'update': {method: 'POST'}
        });
        Article.cmt = $resource('/api/article/:id/comments', {id: '@id'});
        Article.reply = $resource('/api/article/:id/comment',
            {id: '@id',replyUid :'@uid'});
        /*Article.comment=$resource('/api/article/:id/comment',{id:'@id'},{
            'replay':{method:'POST',}
        })*/
        return Article;
    }])
    .factory('Resource', ['$resource', function ($resource) {
      
        var Resource = $resource('/portal/resource/:id', {id: '@id'}, {
            'update': {method: 'POST'}
        });
        Resource.batch = $resource('/portal/resource/batch', {}, {
            'get': {method: 'POST'}
        });
        Resource.getId = $resource('/portal/resource/getId');
        Resource.token = $resource('/portal/qiniu/token');
        return Resource;
    }])
    .factory('ArticleComment', ['$resource', function ($resource) {
      
        var Cmt = $resource('/api/article/comment/:id/love', {id: '@id'}, {
            'update': {method: 'POST', isArray: true},
            'delete': {method: 'DELETE', isArray: true}
        });
        Cmt.report =
            $resource('/api/article/comment/:commentId/report', {commentId:'@commentId'},
             {'commit': {method: 'DELETE'}
        });

        Cmt.del=$resource('/api/article/comment/:commentId', {commentId: '@commentId'});
        return Cmt;
    }])
    .factory('Publish', ['$resource', function ($resource) {
        var Publish = $resource('/api/publish/:id', {id: '@id'}, {
            'update': {method: 'POST'}
        });
        Publish.deliver = $resource('/api/order/:id/deliver', {id: '@id'}, {
            'commit': {method: 'POST'}
        });
        Publish.modify = $resource('/api/order/:orderId/status', {id: '@orderId'}, {
            'update': {method: 'POST'}
        });
        return Publish;
    }])
    .factory('User', ['$resource', function ($resource) {
      
          var  User = $resource('/api/me', {}, {
            'update': {method: 'POST'}
        });
        return User;
    }])
    .service('CheckLogin', ['$rootScope', function ($rootScope) {
        this.check = function () {
            if ($rootScope.login) {

                return true;
            }
            return false;
        }
    }])
    .service('DateFormatter', [function (){
        var service = {};

        function formatDate(d) {
            return d.getFullYear()+'-'+(d.getMonth() + 1) + '-' + d.getDate();
        }

        function formatDate1(d) {
            return (d.getMonth() + 1) + '月' + d.getDate()+"日";
        }
        function formatNumber(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return '' + n;
            }
        }

        function years(d) {
            var date = new Date(d);
            date.setDate(d.getDate()+365);
            return date;
        }

        service.formatActivityDate = function (ts) {
            var date = new Date(ts);
            return formatDate(date) + ' ' + formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes());
        };

        service.formatCommentDate = function (ts) {
            return formatDate1(new Date(ts));
        };
        service.formatListDate = function (ts) {
            return formatDate(new Date(ts));
        };

        service.formatLiveDate = function (ts) {
            var date = new Date(ts);
            var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            return formatNumber(date.getMonth() + 1) + '-' + formatNumber(date.getDate()) + ' ' + formatNumber(date.getHours()) + ':' + formatNumber(date.getMinutes()) + ' ' + weekdays[date.getDay()];
        };
        service.formatNowTime = function () {

            return new Date().getTime();
        };
        service.subscribeTime = function () {
            var date = new Date();
            var date2 = years(date);
            return formatDate(date) +  '至' + formatDate(date2);

        };
        return service;
    }])

    .service('ImageUploader', ['$log', '$http', 'FileUploader', 'Resource', function ($log, $http, FileUploader, Resource) {
        this.initUploader = function ($scope, token, done) {
            var uploader = new FileUploader({
                url: 'http://upload.qiniu.com',
                alias: 'file',
                queueLimit: 1,
                removeAfterUpload: true,
                formData: [
                    {
                        accept: 'text/plain; charset=utf-8',
                        "token": token.token
                    }
                ]
            });
            //document.domain = 'uptx.qiniu.com';
            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function () {
                    return this.queue.length < 1;
                }
            });

            uploader.filters.push({
                name: 'imageFilter',
                fn: function (item) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|'.indexOf(type) !== -1;
                }
            });

            // CALLBACKS
            uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function (fileItem) {
                // if (!CheckLogin.check()) {
                //     uploader.removeFromQueue(fileItem);
                //     return;
                // }
                console.info('onAfterAddingFile', fileItem);
                Resource.getId.get(function (res) {
                    $log.info("resource id:", res.id);
                    fileItem.resId = res.id;
                    fileItem.formData.push({"key": res.id});
                    fileItem.upload();
                    $scope.uploading = true;
                }, function (res) {
                    $scope.uploading = false;
                });
            };
            uploader.onAfterAddingAll = function (addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function (item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onSuccessItem = function (fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);

                function saveResource(resource) {
                    $log.info('create resource:', resource);
                    Resource.save(resource, function () {
                        $log.info("create resource successfully");
                        if (resource.key) {
                            Resource.batch.get({}, {'ids': [resource.key]}, function (data) {
                                if (data.data.length) {
                                    done(data.data[0]);
                                }
                            });
                        }
                        $scope.uploading = false;
                    }, function (res) {
                        $scope.uploading = false;
                    });
                }

                /* IE8,9下，跨域上传会导致response为undefined，针对这种情况，上传后，通过尝试加载来判断上传是否成功了 */
                if (response) {
                    var resource = {name: fileItem.file.name, tp: 0, key: response.key, hash: response.hash};
                    saveResource(resource);
                } else {
                    var url = 'http://' + token.imageDomain + '/' + fileItem.resId + '?imageView2/0/w/640';
                    var img = new Image(); //创建一个Image对象，实现图片的预下载
                    img.onload = function(){
                        var resource = {name: fileItem.file.name, tp: 0, key: fileItem.resId};
                        saveResource(resource);
                    };
                    img.onerror = function () {
                        // Alert.alert('上传失败', true);
                        $scope.uploading = false;
                    };
                    img.src = url;
                }
            };
            uploader.onErrorItem = function (fileItem, response, status, headers) {
                // Alert.alert('上传失败', true);
                console.info('onErrorItem', fileItem, response, status, headers);
                $scope.uploading = false;
            };
            uploader.onCancelItem = function (fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function (fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function () {
                console.info('onCompleteAll');
            };

            return uploader;
        }
    }])
    .service('CookieService', ['$window', function ($window){
        var service = {};

        function setCookie(name, value, path, iDay){
            /* iDay 表示过期时间
             cookie中 = 号表示添加，不是赋值 */
            var oDate=new Date();
            oDate.setDate(oDate.getDate()+iDay);
            document.cookie=name+'='+value+';path=' + path + ';expires='+oDate;
        }

        function getCookie(name){
            /* 获取浏览器所有cookie将其拆分成数组 */
            var arr=document.cookie.split('; ');

            for(var i=0;i<arr.length;i++)    {
                /* 将cookie名称和值拆分进行判断 */
                var arr2=arr[i].split('=');
                if(arr2[0]==name){
                    return arr2[1];
                }
            }
            return '';
        }

        function removeCookie(name, path){
            /* -1 天后过期即删除 */
            setCookie(name, 1, path, -1);
        }

        service.get = function (key) {
            return getCookie(key);
        };

        service.remove = function (key, path) {
            removeCookie(key, path);
        };

        return service;
    }]);

/**
 * Created by Administrator on 2017/03/08.
 */
angular.module('App.myCtrcontrollers',['angular-jqcloud'])
    .controller('myCtr', ['$scope',  '$state','$rootScope','$http',
        function ($scope, $state, $rootScope,$http) {
            $rootScope.state = true;

        }

]);
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
//# sourceMappingURL=../maps/EI.js.map
