angular.module('socialStock.services', [])

	.factory('AccountService', function($q, $http, $rootScope) {
		return {
			login : function(user) {
				var deferred = $q.defer();
	            var url = 'http://portfolioaloptimizer.appspot.com/app/home/login?userName='
	                + user.userName
	                + '&password='
	                + user.password;

	            $http.defaults.useXDomain = true;
		        delete $http.defaults.headers.common['X-Requested-With'];
		        
		        $http({
		        	url: url,
		        	method: 'POST'
		         }).success(function(data, status, headers, config) {
		        	 console.log('Login service success', data);
		             deferred.resolve(data);
		         }).error(function(data, status, headers, config) {
		        	 console.log('Login service failure', status);
		             deferred.reject(data);
		         });
	
	            return deferred.promise;
		     },
			 getUser : function() {
				 var deferred = $q.defer();
				 var authToken = $rootScope.authToken;
		         var url = 'http://portfolioaloptimizer.appspot.com/app/home/getUser' + "?token=" + authToken;
		         $http.get(url).success(function(data, status) {
		             deferred.resolve(data);
		         }).error(function(data, status) {
		             deferred.reject(data);
		         });
	
		         return deferred.promise;
		     },
		     registerUser : function(newUser) {
				 var deferred = $q.defer();
		         var url = 'http://portfolioaloptimizer.appspot.com/app/home/registerUser';

		         // Don't need this if you have allow 'X-Requested-With' inside
		         // 'Access-Control-Allow-Headers' header in the server
		         $http.defaults.useXDomain = true;
		         delete $http.defaults.headers.common['X-Requested-With'];

		         $http({
		        	url: url,
		        	method: 'POST',
		        	data: newUser
		         }).success(function(data, status, headers, config) {
		             deferred.resolve(data);
		         }).error(function(data, status, headers, config) {
		             deferred.reject(data);
		         });

		         return deferred.promise;
		     }
	     }
	 })

	.factory('CompanyService', function($q, $http, $rootScope) {
		var symbols;
		var symbol;
		return {
			setData: function (data) {
				symbol = data;
            },
            getData: function () {
                return symbol;
            },
            setSymbols: function (data) {
            	symbols = data;
            },
            getSymbols: function () {
                return symbols;
            },
            retrieveSymbols: function() {
				var deferred = $q.defer();
	            var url = 'http://portfolioaloptimizer.appspot.com/app/companyData/retrieveSymbols';
	            $http.get(url).success(function(data, status) {
	            	console.log('CSymbols ', data);
	                deferred.resolve(data);
	            }).error(function(data, status) {
	                deferred.reject(data);
	            });

	            return deferred.promise;
		    },
			findAll: function(symbol) {
				var deferred = $q.defer();
	            var url = 'http://portfolioaloptimizer.appspot.com/app/companyData/retrieveCompanyDetailsByJson?symbol=' + symbol;
	            $http.get(url).success(function(data, status) {
	            	console.log('Company data ', data);
	                deferred.resolve(data);
	            }).error(function(data, status) {
	                deferred.reject(data);
	            });

	            return deferred.promise;
		    },
		    getStockRating : function(userName, symbol) {
				 var deferred = $q.defer();
				 var authToken = $rootScope.authToken;
		         var url = 'http://portfolioaloptimizer.appspot.com/app/companyData/retrieveStockRating' 
		        	 + "?token=" + authToken
		        	 + "&userName=" + userName
		        	 + "&symbol=" + symbol;
		         $http.get(url).success(function(data, status) {
		             deferred.resolve(data);
		         }).error(function(data, status) {
		             deferred.reject(data);
		         });
	
		         return deferred.promise;
		     },
		     persistStockRating : function(stockRating) {
				 var deferred = $q.defer();
		         var url = 'http://portfolioaloptimizer.appspot.com/app/companyData/persistStockRating';

		         // Don't need this if you have allow 'X-Requested-With' inside
		         // 'Access-Control-Allow-Headers' header in the server
		         $http.defaults.useXDomain = true;
		         delete $http.defaults.headers.common['X-Requested-With'];

		         $http({
		        	url: url,
		        	method: 'POST',
		        	data: stockRating
		         }).success(function(data, status, headers, config) {
		             deferred.resolve(data);
		         }).error(function(data, status, headers, config) {
		             deferred.reject(data);
		         });

		         return deferred.promise;
		     }
		 }
	 })

	.factory('LoaderService', function($rootScope, $ionicLoading) {
	    // Trigger the loading indicator
	    return {
	        show : function() { //code from the ionic framework doc
	            // Show the loading overlay and text
	        	$rootScope.loading = $ionicLoading.show({
	              // The text to display in the loading indicator
	              content: 'Loading',
	              // The animation to use
	              animation: 'fade-in',
	              // Will a dark overlay or backdrop cover the entire view
	              showBackdrop: true,
	              // The maximum width of the loading indicator
	              // Text will be wrapped if longer than maxWidth
	              maxWidth: 200,
	              // The delay in showing the indicator
	              showDelay: 500
	            });
	        },
	        hide : function() {
	        	$rootScope.loading.hide();
	        }
	    }
	});