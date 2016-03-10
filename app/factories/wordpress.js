angular.module('bjLab')
.factory('wordpress', function($http) {
	urlBase = 'http://www.mmfilesi.com/wp-json/';
	// todo :: interceptores
	return {

		getPosts: function() {
			//return $http.get(urlBase + 'tbjb/v1/posts');
			return $http.get('./app/cache-rest/post.json');
		},

		getPost: function(idPost) {
			return $http.get(urlBase + 'wp/v2/posts/' + idPost);
		},

		getTags: function() {
			return $http.get(urlBase + 'wp/v2/tags?per_page=50&orderby=count&order=desc');
		},

		getPostTcabaret: function() {
			return $http.get('http://www.mmfilesi.com/tcabaret/wp-json/tbjb/v1/posts/');
		}

	}
});