angular.module('bjLab')
    .filter('htmlContent', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);