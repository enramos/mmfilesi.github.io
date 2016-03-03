'use strict';

angular.module('bjLab')
.controller('mainCtrl', ['$scope', 'configBasic', 'wordpress', function($scope, configBasic, wordpress) {

	var allPostData = 'loading';
	
	$scope.allPosts = 'loading';
	$scope.allPags 	= [];

	$scope.allCategories = [
		{'key': 'all', 'value': 'todas'},
		{'key': 'internet', 'value': 'internet'},
		{'key': 'javascript', 'value': 'javascript'},
		{'key': 'php', 'value': 'php'},	
		{'key': 'wordpress', 'value': 'wordpress'},	
		{'key': 'html', 'value': 'html'},	
		{'key': 'electronica', 'value': 'electrónica'},
		{'key': 'varios', 'value': 'varios'}
	];

	$scope.actions = {

		getPagActive: function() {
			return mapData.mult;
		},

		setPag: function(key) {
			mapData.mult = key;
			$scope.allPags = [];
			mapData.filterData();
		},

		setCat: function(cat) {
			mapData.category = cat;
			mapData.resetPag();
			mapData.filterData();
		},

	};

	var mapData = {

		category: 'all',
		minPag: 	0,
		maxPag: 	24,
		mult: 		0,

		resetPag: function() {
			this.minPag 	= 0;
			this.maxPag 	= 24;
			this.mult 		= 0;
			$scope.allPags 	= [];
		},

		filterCategory: function() {
			var selectedPost 	= [],
			len 				= allPostData.length,
			i 					= 0;

			for (; i<len; i++) {
				if ( allPostData[i].category[0].slug == this.category || this.category == 'all' ) {
					selectedPost.push(allPostData[i]);
				}
			}
			return selectedPost;
		},

		filterPag: function() {
			var start 	= this.minPag + (this.mult * 24),
				end 	= this.maxPag + (this.mult * 24),
				count 	= 0,
				i 		= 0,
				temp	= {};

			if ( $scope.allPosts.length > 24 ) {
				count = $scope.allPosts.length/24;
				for (; i<count; i++ ) {
					temp = {'key': i, 'value': i};
					$scope.allPags.push(temp);
				}
			}

			$scope.allPosts = $scope.allPosts.slice(start, end);
		},

		filterData: function() {
			$scope.allPosts = this.filterCategory();
			if ( $scope.allPosts.length > 24 ) {
				this.filterPag();
			} else {
				$scope.allPags = [];
			}
		}

	};

	var rest = {

		getPosts: function() {
			wordpress.getPosts().success(function(data, status, headers, config) {
				allPostData = data;
				mapData.filterData();
			});
		}

	};

	var init = {

		initAll: function() {
			rest.getPosts();
		}

	};

	init.initAll();

}]);