angular.module('bjLab')
.directive('bjHeader', function() {
	return {
		restrict: 'E',
		templateUrl: 'app/header/header.html',
		scope: {
			msg: '='
		},
		link: function (scope, element, attrs) {
		}
	}
});