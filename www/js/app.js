// angular.module is a global place for creating, registering and retrieving Angular modules
// 'socialStock' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'directory.services' is found in services.js
// 'directory.controllers' is found in controllers.js
angular.module('socialStock', ['ionic', 'ngGrid', 'angucomplete', 'ngRoute', 'ngCookies', 'socialStock.services', 'socialStock.controllers', 'socialStock.directives'])

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

	        .state('menu', {
	            url: "/menu",
	            abstract: true,
	            templateUrl: "templates/menu.html"
	        })

	        .state('welcome', {
	            url: "/welcome",
	            templateUrl: "templates/welcome.html",
	            controller: 'MainCtrl'
	        })

	        .state('menu.home', {
	            url: "/home",
	            views: {
	              'menuContent' :{
	                templateUrl: "templates/home.html"
	              }
	            }
	        })

	        .state('menu.createAccount', {
	            url: "/createAccount",
	            views: {
	              'menuContent' :{
	                templateUrl: "templates/createAccount.html",
	                controller: "AccountCtrl"
	              }
	            }
	        })

            .state('menu.company-index', {
                url: '/companies',
                views: {
                  'menuContent' :{
                    templateUrl: "templates/company-index.html",
                    controller: "CompanyIndexCtrl"
                  }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/welcome');

        /* Register error provider that shows message on failed requests or redirects to login page on
		 * unauthenticated requests */
	    $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
	        return {
	        	'responseError': function(rejection) {
	        		var status = rejection.status;
	        		var config = rejection.config;
	        		var method = config.method;
	        		var url = config.url;
	      
	        		if (status == 401) {
	        			$location.path( "/login" );
	        		} else {
	        			$rootScope.error = method + " on " + url + " failed with status " + status;
	        		}
	              
	        		return $q.reject(rejection);
	        	}
	        };
	    });

        /* Registers auth token interceptor, auth token is either passed by header or by query parameter
	     * as soon as there is an authenticated user */
	    $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
	        return {
	        	'request': function(config) {
	        		var isRestCall = config.url.indexOf('app') == 0;
	        		if (isRestCall && angular.isDefined($rootScope.authToken)) {
	        			var authToken = $rootScope.authToken;
	        			if (exampleAppConfig.useAuthTokenHeader) {
	        				config.headers['X-Auth-Token'] = authToken;
	        			} else {
	        				config.url = config.url + "?token=" + authToken;
	        			}
	        		}
	        		return config || $q.when(config);
	        	}
	        };
	    });

    });