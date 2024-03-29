app.factory('user', function ($window, $cookies, $http, $rootScope) {
    var sessionID = $cookies.get('MailJS');
    var user = {};

    // Events:
    // userLoaded

    function getUser() {
        return user;
    }

    (function () {
        var req = {
            method: 'GET',
            url: '/api/v1/user/current',
            headers: {
                'x-token': sessionID
            }
        };
        $http(req).then(function(res) {
            if(res.data.user.mailboxes.length === 0) {
                $window.location.href = '/index.html?setup=true';
                return;
            }
            user = res.data.user;
            $rootScope.$emit('userLoaded');
        }, function(res) {
            $cookies.remove('MailJS');
            if(res.data.error) {
                $window.location.href = '/index.html?msg='+res.data.error.message;
                return;
            } else {
                $window.location.href = '/index.html?msg=Authentication%20error.';
                return;
            }
        });
    })();

    function logout() {
        $http({
            method: 'DELETE',
            url: '/api/v1/login',
            headers: {
                'x-token': sessionID
            }
        }).then(function(res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
            return;
        }, function(res) {
            $cookies.remove('MailJS');
            $window.location.href = '/index.html?info=true&msg=Logout%20Succesfull,%20goodbye!';
            return;
        });
    }

    return {
        logout: logout,
        sessionID: sessionID,
        getUser: getUser
    };
});
