'use strict';

angular.module('bjLab')
.controller('mainCtrl', ['$scope', '$state', 'configBasic', 'allData',  'utils',
	function($scope, $state, configBasic, allData, utils) {

	var allPostData = 'loading';
	
	$scope.allPosts 		= 'loading';
	$scope.allPags 			= [];
	$scope.allPostsSlider 	= [];

	// todo :: pasar a un utils
	var mgs = {
		showError: function(msg) {
			$scope.msgText	= msg;
			$scope.msgType 	= 'msg-ko';
			$scope.msgShow 	= 'msg-show';
		},

		showSuccess: function(msg) {
			$scope.msgText	= msgText;
			$scope.msgType 	= 'msg-ok';
			$scope.msgShow 	= 'msg-show';
		}
	};

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
		},

		// de momento, solo hay uno, pero la idea es
		// armar aquí el slider :: todo
		dataSlider: function() {
			var itemTemp 	= {},
				i 			= 0,
				len 		= 1; // cambiar cuando tenga el slider

			for (; i<len; i++) {
				itemTemp = utils.preparePost(allPostData[i]);
				$scope.allPostsSlider.push(itemTemp);
			}
		}

	};

	var rest = {

		getPosts: function() {
			allData.getPosts().then(
				function successCallback(data) {
					allPostData = data;
					mapData.dataSlider();
					mapData.filterData();

				}, function errorCallback(response) {
				    // todo :: implementar interceptores
				    mgs.showError('error en la conexión');
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