angular.module('bjLab', [
	'ui.router',
	'ngSanitize',
	'ngAnimate'
	]).
	config(function($stateProvider, $urlRouterProvider) { 

	  $urlRouterProvider.otherwise('/main');

	  $stateProvider
		  .state('main', {
		  		url: '/main',
		  		templateUrl: 'app/main/main.html',
		  		controller: 'mainCtrl'
		  })
		  .state('articles', {
			  	url: '/articles"',
			  	templateUrl: 'app/articles/articles.html',
		  		controller: 'articlesCtrl'
		  });


		}).
		run(function() {

		});