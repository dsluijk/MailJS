(function () {
'use strict';

app.controller('mailCtrl', function($rootScope, $scope, $routeParams, $window, user, $http, notification, mailbox, $location, hotkeys) {
	$rootScope.isLoading = true;
	$scope.mail = {};

	var init = function () {
		var req = {
			method: 'GET',
			url: '/api/v1/email/' + $routeParams.uuid,
			headers: {
				'x-token': user.sessionID
			}
		};
		$http(req).then(function(res) {
			$rootScope.isLoading = false;
			$scope.mail = res.data.mail;
		}, function(res) {
			$rootScope.isLoading = false;
			notification.send('Could not get mail!', res.data.message, 'error');
			for (var j = 0; j < mailbox.getCurrent().inboxes.length; j++) {
				if(mailbox.getCurrent().inboxes[j].type == "Inbox") {
					$location.path("/mailbox/"+mailbox.getCurrent().inboxes[j]._id);
				}
			}
		});
	};

	hotkeys.bindTo($scope).add({
		combo: 'del',
		description: 'Delete E-mail.',
		callback: function() {
			$rootScope.isLoading = true;
			var req = {
				method: 'DELETE',
				url: '/api/v1/email/' + $routeParams.uuid,
				headers: {
					'x-token': user.sessionID
				}
			};
			$http(req).then(function(res) {
				$rootScope.isLoading = false;
				notification.send('Email deleted.', '', 'info');
				$window.location.href = '#/mailbox/'+$scope.mail.inbox;
			}, function(res) {
				$rootScope.isLoading = false;
				notification.send('Could not delete mail!', res.data.error.message, 'error');
			});
		}
	}).add({
		combo: 'backspace',
		description: 'Go back to the inbox.',
		callback: function() {
			$window.location.href = '#/mailbox/'+$scope.mail.inbox;
		}
	});

	$scope.deleteMail = function () {
		$rootScope.isLoading = true;
		var req = {
			method: 'DELETE',
			url: '/api/v1/email/' + $routeParams.uuid,
			headers: {
				'x-token': user.sessionID
			}
		};
		$http(req).then(function(res) {
			$rootScope.isLoading = false;
			notification.send('Email deleted.', '', 'info');
			$window.location.href = '#/mailbox/'+$scope.mail.inbox;
		}, function(res) {
			$rootScope.isLoading = false;
			notification.send('Could not delete mail!', res.data.error.message, 'error');
		});
	};

	$scope.downloadAttachment = function (attachment) {
		$rootScope.isLoading = true;
		var req = {
			method: 'GET',
			url: '/api/v1/email/' + $routeParams.uuid + '/attachment/' + attachment.contentId,
			headers: {
				'x-token': user.sessionID,
				'Accept': attachment.contentType
			}
		};
		$http(req).then(function(res) {
			$rootScope.isLoading = false;
			var x=window.open('data:'+attachment.contentType+';base64,'+res.data);
			$rootScope.isLoading = false;
		}, function(res) {
			$rootScope.isLoading = false;
			notification.send('Could not get attachment!', res.data.error.message, 'error');
		});
	};

	$scope.getAttachmentType = function (contentType) {
		switch (contentType.split('/')[0]) {
			case 'image':
				return 'fa-file-image-o';
			case 'audio':
				return 'fa-file-audio-o';
			case 'video':
				return 'fa-file-video-o';
			case 'application':
				switch (contentType.split('/')[1]) {
					case 'pdf':
						return 'fa-file-pdf-o';
					case 'octet-stream':
						return 'fa-file-archive-o';
					case 'zip':
						return 'fa-file-archive-o';
					case 'msword':
						return 'fa-file-word-o';
					case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
						return 'fa-file-word-o';
					case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
						return 'fa-file-exel-o';
					case 'vnd.ms-powerpoint':
						return 'fa-file-powerpoint-o';
					case 'vnd.openxmlformats-officedocument.presentationml.presentation':
						return 'fa-file-powerpoint-o';
					default:
						return 'fa-file-o';
				}
				break;
			default:
				return 'fa-file-o';
		}
	};

    if(typeof user.getUser()._id == 'undefined') {
        $rootScope.$on('userLoaded', function () {
            init();
        });
    } else {
        init();
    }
});
}());
