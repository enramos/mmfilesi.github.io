angular.module('bjLab', [
	'ui.router',
	'ngSanitize',
	'ngAnimate'
	]).
	config(function($stateProvider, $urlRouterProvider) { 

	  $urlRouterProvider.otherwise('/');

	  $stateProvider
		  .state('main', {
		  		url: '/',
		  		templateUrl: 'app/main/main.html',
		  		controller: 'mainCtrl'
		  })
		  .state('archive', {
			  	url: '/archive/:type/:id',
			  	params: {
			        type: '',
			        id: ''
			    },
			  	templateUrl: 'app/archive/archive.html',
		  		controller: 'archiveCtrl'
		  })
		  .state('articles', {
			  	url: '/articles/:id',
			  	templateUrl: 'app/articles/articles.html',
		  		controller: 'articlesCtrl',
		  		params: {
			        id: ''
			    },
		  });


		}).
		run(function() {

		});