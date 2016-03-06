'use strict';

angular.module('bjLab')
	.controller('archiveCtrl', ['$scope', '$state', '$stateParams', 'configBasic', 'allData', 
        function($scope, $state, $stateParams, configBasic, allData) {

        $scope.results      = 'pending';
        $scope.mainTitle    = '';
        $scope.allPosts     = [];
        $scope.orderPost    = false;

        var showPosts = {
            init: function(data) {
                $scope.results = 'done';
                $scope.allPosts = data;
            }
        };

        var noResults = {

            showMsg: function() {
                $scope.results = 'none';               
            }
        };

        var rest = {

            getPosts: function() {
                allData.filterPost($stateParams.type, $stateParams.id)
                    .then(showPosts.init, noResults.showMsg);
            }
        };

        var init = {

            getWorkshopTitle: function(slug) {
                allData.getWorkshops().then(function(data) {
                    var allWorkshops = data,
                        i = 0,
                        len = allWorkshops.length;

                    $scope.mainTitle = 'Taller: ';
                    for (; i<len; i++) {
                        if ( allWorkshops[i].key == $stateParams.id) {
                            $scope.mainTitle += allWorkshops[i].value;
                            break;
                        }
                    }
                });
            },

            showTitle: function() {
                if ( $stateParams.type == 'tags' ) {
                    $scope.mainTitle = 'Tag: '+ $stateParams.id;
                } else if ( $stateParams.type == 'category' ) {
                    $scope.mainTitle = 'Categoría: '+ $stateParams.id;
                } else if ( $stateParams.type == 'workshop' ) {
                    this.getWorkshopTitle();
                }
            },

            initAll: function() {
                if ( !$stateParams.type || !$stateParams.id ) {
                    noResults.showMsg();
                    return;
                }
                rest.getPosts();
                this.showTitle();
            }
        };
        
        // $state.go('archive', {'type': 'workshop', 'id': 'angular'});
        // $stateParams.type = 'workshop';
        //$stateParams.id = 'angular';
        init.initAll();
}]);