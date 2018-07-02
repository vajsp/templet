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