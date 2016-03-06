angular.module('bjLab')
	.factory('allData', function($q, wordpress) {

		var allData = {},
			self 	= allData; // cacheamos en self el objeto para no volvernos tarumbas con el this

		/* Objeto auxiliar que sirve para mapear los datos */
		var mapData = {

			findIdPostBySlug: function(slugPost) {
				var i 	= 0,
					len = allData.allPost.length;

				for (; i<len; i++) {
					if ( allData.allPost[i].name == slugPost ) {
						return allData.allPost[i].id;
					}
				}
			},

			filterByTags: function(id) {
				var postsFiltered = [],
					i,
					len,
					j,
					lec;

				if ( !id ) {
					return postsFiltered;
				}

				i = 0; 
				len = allData.allPost.length;

				for (; i<len; i++) {
					j = 0;
					lec = allData.allPost[i].tags.length;
					for (; j<lec; j++) {
						if ( allData.allPost[i].tags[j].slug == id ) {
							postsFiltered.push(allData.allPost[i]);
						}
					}
					
				}
				return postsFiltered;
			},

			filterByCategory: function(id) {
				var postsFiltered = [],
					i,
					len,
					j,
					lec;

				if ( !id ) {
					return postsFiltered;
				}

				i = 0; 
				len = allData.allPost.length;

				for (; i<len; i++) {
					j = 0;
					lec = allData.allPost[i].category.length;
					for (; j<lec; j++) {
						if ( allData.allPost[i].category[j].slug == id ) {
							postsFiltered.push(allData.allPost[i]);
						}
					}
					
				}
				return postsFiltered;
			},

			filterByWorkshop: function(id) {
				var postsFiltered = [],
					i,
					len,
					j,
					lec;

				if ( !id ) {
					return postsFiltered;
				}

				i = 0; 
				len = allData.allPost.length;

				for (; i<len; i++) {
					j = 0;
					lec = allData.allPost[i].workshop.length;
					for (; j<lec; j++) {
						if ( allData.allPost[i].workshop[j].slug == id ) {
							postsFiltered.push(allData.allPost[i]);
						}
					}
					
				}
				return postsFiltered;
			},

			init: function(type, id) {
				var posts = [];

                switch(type) {
                    case 'tags':
                        posts = this.filterByTags(id);
                        break;
                    case 'category':
                        posts = this.filterByCategory(id);
                        break;
                    case 'workshop':
                        posts = this.filterByWorkshop(id);
                        break;
                    default:
                       posts = [];
                }
                return posts;
			}
		};

		/* Inicializamos los datos que vamos a almacenar */
		allData.allPost 	= 'pending';
		allData.categories 	= 'pending';
		allData.tags 		= 'pending';

		/* tengo que estudiar el rendimiento de cargar los dos jsons,
		quizás este lo deje al final siempre x ajax y no lo cachee */
		allData.allPostTcabaret = 'pending';

		/* Todos estos objetos devuelven promesas, que a su vez se 
		alimentan de las promesas que trae de fábrica el objeto $http
		de angular */

		allData.getPosts = function() {
			/* Creamos la promesa */
			var deferred = $q.defer();

			/* Si ya hemos cargado los posts,
			definimos la promesa como resuelta */
			if ( self.allPost !== 'pending' ) {
				deferred.resolve(self.allPost);	

			/* En el caso contrario, los solicitamos
			a la factoría */
			} else {
				wordpress.getPosts().then(
					function successCallback(response) {
						self.allPost = response.data;
						deferred.resolve(self.allPost);
					}, function errorCallback(response) {
					    deferred.reject(response);
					});
			}

			/* Devolvemos la promesa */
			return deferred.promise;
		};

		allData.filterPost = function(type, id) {
			var deferred = $q.defer();
			self.getPosts().then(
				function(data) {
					var posts = [];
					if ( type && id ) {
						posts = mapData.init(type, id); 
					}
					deferred.resolve(posts);					

				}, function(response) {
					deferred.reject(response);
				});

			return deferred.promise;
		};

		allData.getPost = function(slugPost) {
			var deferred = $q.defer();

			self.getPosts().then(
				function successCallback() {
					var idPost = mapData.findIdPostBySlug(slugPost);

					wordpress.getPost(idPost).then(
						function successCallback(response) {
							deferred.resolve(response.data);
						}, function errorCallback(response) {
						    deferred.reject(response);
						});

				}, function(response) {
					deferred.reject(response);
				});

			return deferred.promise;
		};

		/* Lo dejo preparado como promesa por si en un futuro
		lo cojo dinámicamente */
		allData.getCategories = function() {
			var deferred = $q.defer();
			var categories = [
				{'key': 'all', 'value': 'todas'},
				{'key': 'internet', 'value': 'internet'},
				{'key': 'javascript', 'value': 'javascript'},
				{'key': 'php', 'value': 'php'},	
				{'key': 'wordpress', 'value': 'wordpress'},	
				{'key': 'html', 'value': 'html'},	
				{'key': 'electronica', 'value': 'electrónica'},
				{'key': 'varios', 'value': 'varios'}
			];

			deferred.resolve(categories);

			return deferred.promise;
		};

		allData.getWorkshops = function() {
			var deferred = $q.defer();
			var workshops = [
				{'key': 'web-components', 'value': 'web components y polymer'},
				{'key': 'test-js', 'value': 'tests js'},
				{'key': 'express-2', 'value': 'express'},
				{'key': 'node-2', 'value': 'node'},
				{'key': 'mongo', 'value': 'mongo'},	
				{'key': 'angular', 'value': 'angular'},	
				{'key': 'cordova', 'value': 'cordova'},	
				{'key': 'dom', 'value': 'trasteando con el dom'},
				{'key': 'javascript-orientado-a-objetos', 'value': 'javascript orientado a objetos'},
				{'key': 'php-orientado-a-objetos', 'value': 'php orientado a objetos'},
				{'key': 'wordpress-desde-cero', 'value': 'wordpress desde cero'},
				{'key': 'jquery-desde-cero', 'value': 'jquery desde cero'}
			];

			deferred.resolve(workshops);

			return deferred.promise;
		};


		allData.getTags = function() {
			var deferred = $q.defer();

			if ( self.tags !== 'pending' ) {
				deferred.resolve(self.tags);	
			} else {
				wordpress.getTags().then(
					function successCallback(response) {
						self.tags = response.data;
						deferred.resolve(self.tags);
					}, function errorCallback(response) {
					    deferred.reject(response);
					});
			}
			return deferred.promise;
		};


		allData.getPostTcabaret = function(slugPost) {
			var deferred = $q.defer();

			if ( self.allPostTcabaret !== 'pending' ) {
				deferred.resolve(self.allPostTcabaret);	
			} else {
				wordpress.getPostTcabaret().then(
					function successCallback(response) {
						self.allPostTcabaret = response.data;
						deferred.resolve(self.allPostTcabaret);
					}, function errorCallback(response) {
					    deferred.reject(response);
					});
			}

			/* Devolvemos la promesa */
			return deferred.promise;
		};

		return allData;
	});