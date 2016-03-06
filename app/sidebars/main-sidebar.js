'use strict';

angular.module('bjLab')
.directive('bjMainSidebar',['allData', function(allData) {
	return {
		restrict: 'E',
		templateUrl: 'app/sidebars/main-sidebar.html',
		scope: {
		},
		link: function (scope, element, attrs) {
			var allPosts 			= [];

			scope.allTags 			= [];
			scope.workshops 		= [];
			scope.inputSearch 		= {'value': ''};
			scope.postFiltered 		= [];
			scope.postLoaded 		= 'pending';
			scope.allPostsTCabaret 	= [];

			var utils = {

				/* todo :: llevar a utils */
				findInArray: function(value, arr) {
					var i = 0,
						len = arr.length;

					for (; i<len; i++) {
						if ( arr[i].name.toLowerCase() == value ) {
							return true;
						}

					}
					return false;
				}
			};

			scope.actions = {
				searchPost: function() {
					var i 		= 0,
						len 	= allPosts.length,
						value 	= scope.inputSearch.value.toLowerCase();

					scope.postFiltered 	= [];

					if ( !len ) {
						return;
					}
					if ( scope.inputSearch.value.length < 3 ) {
						return;
					}
					for (; i<len; i++) {
						if ( (allPosts[i].title && (allPosts[i].title.toLowerCase()).indexOf(value) != -1) ||
							 (allPosts[i].sumary && allPosts[i].sumary.indexOf(value) != -1) || 
							 (allPosts[i].tags && utils.findInArray(value, allPosts[i].tags)) || 
							 (allPosts[i].category && utils.findInArray(value, allPosts[i].category))
							) {
							scope.postFiltered.push(allPosts[i]);
						}
					}
				},

				resetSearch: function() {
					if ( scope.inputSearch.value.length === 0 ) {
						scope.postFiltered 	= [];
					}
				}
			}; 

			var rest = {

				getWorkshops: function() {
					allData.getWorkshops()
						.then(function(data) {
							scope.workshops = data;
						}, function() {

						});
				},

				getTags: function() {
					allData.getTags()
						.then(function(data) {
							scope.allTags = data;
						}, function() {

						});

				},

				getPosts: function() {
					allData.getPosts().then(
						function successCallback(data) {
							scope.postLoaded 	= 'done';
							allPosts 			= data;
						}, function errorCallback(response) {
						});
				},

				getPostsTCabaret: function() {
					// TODO
					allData.getPostTcabaret().then(
						function successCallback(data) {
							scope.allPostsTCabaret = data;
						}, function errorCallback(response) {
						});
				}
			};

			var init = {
				initAll: function() {
					rest.getWorkshops();
					rest.getTags();
					rest.getPosts();
					//rest.getPostsTCabaret();					
				}
			};

			init.initAll();

		}
	}
}]);