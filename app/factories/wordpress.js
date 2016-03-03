angular.module('bjLab')
.factory('wordpress', function($http) {
	urlBase = 'http://www.mmfilesi.com/wp-json/tbjb/v1/';
	return {

		getPosts: function() {
			return $http.get(urlBase + 'posts');
		}

	}
});