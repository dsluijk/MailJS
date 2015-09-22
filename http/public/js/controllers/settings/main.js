'use strict';

app.controller("mainSettingsCtrl", function($scope, $rootScope, $translate, $http, $window, notification) {
    $rootScope.isLoading = false;
    $scope.lang = $translate.use();
    $scope.TFAactivated = false;
    $scope.notifyTimeout = parseInt(notification.notifyTimeout);
    $scope.hasAPI = notification.hasAPI;
    $scope.changeLanguage = function changeLanguage() {
        $translate.use($scope.lang);
    };
    $scope.updateTimeout = function () {
        var newTimeout = notification.setTimeout($scope.notifyTimeout);
        if(newTimeout != false) {
            $scope.notifyTimeout = newTimeout;
        }
    }
    $scope.askPerms = function () {
        $scope.notifyToggle = notification.askPermissions($scope.notifyToggle);
    }
    $scope.checkVerify = function () {
        if($scope.verifyCode.length == 7) {
            $rootScope.isLoading = true;
            var code = $scope.verifyCode.replace('-', "");
            if($scope.TFAactivated == true) {
                $http({
                    method: 'DELETE',
                    url: '/api/v1/2fa',
                    headers: {
                        'x-token': $scope.sid
                    },
                    data: {
                        'code': code
                    }
                }).then(function(res) {
                    return $window.location.href = '/index.html?msg=2FA%20successfull%disabled!%20Please%20login%20again.&info=true';
                }, function(res) {
                    $rootScope.isLoading = false;
                    if(res.status == 400) {
                        notification.send('Invalid Code', 'The given code was invalid, please try again.', 'error');
                    } else {
                        notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
                    }
                });
                $rootScope.isLoading = false;
            } else {
                $http({
                    method: 'POST',
                    url: '/api/v1/2fa',
                    headers: {
                        'x-token': $scope.sid
                    },
                    data: {
                        'code': code
                    }
                }).then(function(res) {
                    return $window.location.href = '/index.html?msg=2FA%20successfull%20enabled!%20Please%20login%20again.&info=true';
                }, function(res) {
                    $rootScope.isLoading = false;
                    if(res.status == 400) {
                        notification.send('Invalid Code', 'The given code was invalid, please try again.', 'error');
                    } else {
                        notification.send('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
                    }
                });
            }
        }
    }
    $scope.loadTFA = function () {
        $http({
            method: 'GET',
            url: '/api/v1/2fa',
            headers: {
                'x-token': $scope.sid
            }
        }).then(function(res) {
            $scope.isLoading = false;
            $scope.TFAactivated = false;
            $scope.QRdata = res.data.uri;
            $scope.key = res.data.key;
        }, function(res) {
            if(res.status == 401) {
                $cookies.remove('MailJS');
                return $window.location.href = '/index.html?msg=Token%20invalid.';
            } else if(res.status == 400) {
                $scope.TFAactivated = true;
            } else {
                $scope.sendNotification('Internal Server Error', 'The server errored, please report this to your sysadmin.', 'error');
            }
        });
    }
    if($scope.sid) {
        $scope.loadTFA;
    } else {
        $rootScope.$on('userLoaded', function() {
            $scope.loadTFA();
        });
    }
});
