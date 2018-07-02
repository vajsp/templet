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