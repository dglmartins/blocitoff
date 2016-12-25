
(function() {
	function config($stateProvider, $locationProvider, $urlRouterProvider) {

		$locationProvider
			.html5Mode({
				enabled: true,
				requireBase: false
		});

		$stateProvider
			// login state with AuthCtrl as auth controller
			.state('login', {
				url: '/login',
				controller: 'AuthCtrl as auth',
				templateUrl: 'templates/login.html'
		})
			// home state requires sign in via resolve.
			.state('home', {
				url: '/home',
				controller: 'HomeCtrl as home',
				templateUrl: 'templates/home.html',
        resolve: {
        // controller will not be loaded until requireAuth resolves
				// Although a $requireSignIn firebase function exists I used my own
				// resolve promise to practive resolves and promises.
        // Auth refers to our $firebaseAuth wrapper in the factory below
        "currentAuth": ["AuthFactory", function(AuthFactory) {
          // requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError "AUTH_REQUIRED"
					// the error will be caught and the user redirected to login.
          return AuthFactory.requireAuth();
        }]
      }

		});

    $urlRouterProvider.otherwise("/home");

	}

	function catchResolveErrors($rootScope, $state, $timeout) {
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    // catch the error thrown when promise rejected
    // and redirect the user to login
			if (error === "AUTH_REQUIRED") {
				console.log("requires sign in, redirecting to login");
				$timeout(function() {
					$state.go('login');
				});
			}
		});
	}

	angular
		.module('blocitoff', ['firebase', 'ui.router'])
		.config(config)
		.run(['$rootScope', '$state', '$timeout', catchResolveErrors]);


})();
