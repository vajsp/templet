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
