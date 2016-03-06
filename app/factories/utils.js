angular.module('bjLab')
	.factory('utils', function() {

		var utils = {},
			self = utils;

        utils.prepareDate = function(date) {
            var temp = date.split(' ');

            temp = temp[0].split('-');
            temp = temp[2] + '-' + temp[1] + '-' + temp[0];
            return temp;
        };

        utils.prepareImgLarge = function(img) {
            var temp = img.replace('-300x150', '');

            return temp;
        };

		utils.preparePost = function(post) {
			var itemTemp 			= {};

            itemTemp.id             = post.id; 
            itemTemp.title          = post.title;
            itemTemp.sumary         = post.sumary;
            itemTemp.thumbnail      = ( post.thumbnail ) ? self.prepareImgLarge(post.thumbnail) : 'http://mmfilesi.com/wp-content/themes/the-bit-jazz-theme/img/sinimagen.jpg';
            itemTemp.thumbnailCap 	= self.prepareImgLarge(post.thumbnailCaption)
            itemTemp.date           = self.prepareDate(post.date);
            itemTemp.dateInt		= post.date.split(' ').shift();
            itemTemp.category       = post.category[0].category_nicename;
            itemTemp.idCategory     = post.category[0].slug;
            itemTemp.tags           = post.tags;
            itemTemp.workshop 		= ( post.workshop && post.workshop.length ) ? post.workshop[0].name : '';
            itemTemp.idWorkshop 	= ( post.workshop && post.workshop.length ) ? post.workshop[0].slug : '';

            return itemTemp;
		};

		return utils;
	});

angular.module('bjLab')
	.factory('msgs', function($scope) {

		var messages = {
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

		return messages;
	});