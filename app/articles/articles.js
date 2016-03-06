'use strict';

angular.module('bjLab')
	.controller('articlesCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'configBasic', 'allData', 'wordpress', 'utils',
        function($scope, $state, $stateParams, $timeout, configBasic, allData, wordpress, utils) {

        $scope.allPost = {
            basicData:     'pending',
            contentData:   'pending',
            tags:          []
        };

        $scope.zoomArticles = 1;

       var showPost = {

            basicData: function(posts) {
                var i       = 0,
                    len     = ( angular.isArray(posts) ) ? posts.length : 0;

                if ( len === 0 ) {
                    noResults.showMsg();
                    return false;
                }
                for (; i<len; i++) {
                    if ( posts[i].name == $stateParams.id ) {
                        $scope.allPost.basicData = posts[i];
                        break;
                    } 
                }
                if ( $scope.allPost.basicData == 'pending' ) {
                    noResults.showMsg();
                    return false;
                }

                $scope.allPost.basicData = utils.preparePost($scope.allPost.basicData);

                return true;
            },

            contentData: function(data) {
                $scope.results              = 'done';
                $scope.allPost.contentData  = data.content.rendered;
            }
        };

        var noResults = {

            showMsg: function() {
                $scope.results = 'none';               
            }
        };

        var rest = {

            getBasicData: function() {
                allData.getPosts()
                    .then(showPost.basicData, noResults.showMsg);
            },

            getContentData: function() {
                allData.getPost($stateParams.id)
                    .then(showPost.contentData, noResults.showMsg);
            }
        };

        var init = {

            initAll: function() {
                if ( !$stateParams.id ) {
                   $state.go('main');
                }
                rest.getBasicData();
                rest.getContentData();
            }
        };
        
        init.initAll();

}]);