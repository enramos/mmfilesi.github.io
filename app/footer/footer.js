angular.module('bjLab')
.directive('bjFooter', function() {
	return {
		restrict: 'E',
		templateUrl: 'app/footer/footer.html',
		scope: {
			msg: '='
		},
		link: function (scope, element, attrs) {
		}
	}
});