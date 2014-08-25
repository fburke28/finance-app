angular.module('socialStock.controllers', [])

	.controller('MainCtrl', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicModal, $location, $cookieStore, $ionicPopup, AccountService) {
		$ionicModal.fromTemplateUrl('templates/modal.html', function(modal) {
		    $scope.modal = modal;
		  }, {
		    animation: 'slide-in-up',
		    focusFirstInput: true
		  });

		$scope.leftButtons = [{
		  type: 'button-icon button-clear ion-navicon',
		  tap: function(e) {
		    $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
		  }
		}],
		$scope.rightButtons = [{
            type: 'button-icon button-clear ion-person',
            tap: function(e) {
                $scope.modal.show();
            }
          }
        ],
        $scope.homeButton = [{
            type: 'button-icon button-clear ion-person',
            tap: function(e) {
            	$location.path("/welcome");
            }
          }
        ],
        $scope.logoutButton = [{
            type: 'button-icon button-clear ion-log-out',
            tap: function(e) {
              $scope.showConfirm();
            }
          }
        ];

        // A confirm dialog
        $scope.showConfirm = function() {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Are you sure you want to logout?'
          });
          confirmPopup.then(function(res) {
            if(res) {
            	delete $rootScope.user;
        	    delete $rootScope.authToken;
        		$cookieStore.remove('authToken');
                $location.path("/welcome");
            } else {
            	console.log('Stay logged in.');
            }
          });
        };

	})

    .controller('ModalCtrl', function($scope, $rootScope, $location, $cookieStore, LoaderService, AccountService, CompanyService) {
    	$scope.rememberMe = false;

    	$scope.closeModal = function() {
            $scope.modal.hide();
        }

    	$scope.login = function(user) {
    		console.log('Login user ', user);
        	// Show loader from service
        	LoaderService.show();
        	var promise = AccountService.login(user);
            promise.then(
                function(authenticationResult) {
                	console.log('Auth token', authenticationResult);
                	var authToken = authenticationResult.token;
        			$rootScope.authToken = authToken;
        			if ($scope.rememberMe) {
        				$cookieStore.put('authToken', authToken);
        			}
        			$scope.getUser();
        			var promise = CompanyService.retrieveSymbols();
        			promise.then(
    	                function(symbols) {
    	                	CompanyService.setSymbols(symbols);
    	                }
    	                ,function(reason) {
    	                	alert('Failed: ' + reason);
    	                }
    	           );   
                }
                ,function(reason) {
                	alert('Failed to process auth: ' + reason);
                }
            );
        }

    	$scope.getUser = function() {
    		console.log('Getting user');
        	var promise = AccountService.getUser();
            promise.then(
                function(account) {
                	console.log('Got user ', account);
                	$rootScope.account = account;
                	$scope.closeModal();
                	LoaderService.hide();
                	$location.path("/menu/home");
                }
                ,function(reason) {
                	alert('Failed: ' + reason);
                }
            );
        };

    })

    .controller('AccountCtrl', function ($scope, $ionicSideMenuDelegate, $location, LoaderService, AccountService) {
    	$scope.doRegister = function(newUser) {
    		console.log('Account to register ', newUser);
    		// Show loader from service
        	LoaderService.show();
        	var promise = AccountService.registerUser(newUser);
        	promise.then(
	            function(status) {
	            	$scope.registrationSuccess = "Successfully created user account.";
                	LoaderService.hide();
                	$location.path("/menu/welcome");
	            }
	            ,function(reason) {
	            	alert('Failed: ' + reason);
	            }
	        );
        };
    })

    .controller('CompanyIndexCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopup, LoaderService, CompanyService) {
    	$scope.symbols =  CompanyService.getSymbols();

        $scope.trackerImg = "";

        $scope.sideMenuController.toggleLeft();

        $scope.properties = [];

        $scope.gridOptions = {
        	data: 'properties',
        	columnDefs: [{
        	    field: 'name',
        	    width: '250px',
        	    resizable: true,
        	    displayName: 'Name'
        	}, {
        	    field: 'value',
        	    width: '250px',
        	    resizable: true,
        	    displayName: 'Value'
        	}],
        	jqueryUITheme: true 
        };

        $scope.$watch(function () {
            return CompanyService.getData();
        }, function (newvalue, oldvalue) {
            if (newvalue === oldvalue) return;
            console.log('Changed! ' + oldvalue + ', ' + newvalue);
            $scope.findAllCompanies(newvalue);
        });

        $scope.getStockRatings = function() {
        	var promise = CompanyService.getStockRating($rootScope.account.userName, $scope.company.symbol);
            promise.then(
                function(stockRating) {
                	if(!stockRating) {
                		stockRating = {
                		    "userName": $rootScope.account.userName, "symbol": $scope.company.symbol, "stockRating": 0, "comment": ""
                		};
                	}
                	$scope.stockRating = stockRating;
                }
                ,function(reason) {
                	alert('Failed to retrieve stock rating.' + reason);
                }
            );
        }

        $scope.showRatingsPopup = function () {
        	$ionicPopup.show({
                templateUrl: 'templates/companyRatingPopup.html',
                title: 'Enter Rating Value',
                subTitle: 'User Rating',
                scope: $scope,
                buttons: [
                  { text: 'Cancel', onTap: function(e) { return true; } },
                  {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                      var promise = CompanyService.persistStockRating($scope.stockRating);
                      promise.then(
                        function(stockRating) {
                          alert('Rating successfully saved.');
                        }
                        ,function(reason) {
                          alert('Failed to persist stock rating.' + reason);
                        }
                      );
                      return true;
                    }
                  },
                ]
                }).then(function(res) {
                  console.log('Tapped!', res);
                }, function(err) {
                  console.log('Err:', err);
                }, function(msg) {
                  console.log('message:', msg);
                });
        }

        $scope.showRatingsCommentPopup = function () {
        	$ionicPopup.show({
                templateUrl: 'templates/companyCommentPopup.html',
                title: 'Enter Comment For Company',
                subTitle: 'User Comment',
                scope: $scope,
                buttons: [
                  { text: 'Cancel', onTap: function(e) { return true; } },
                  {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                      return $scope.data.rating;
                    }
                  },
                ]
                }).then(function(res) {
                  console.log('Tapped!', res);
                }, function(err) {
                  console.log('Err:', err);
                }, function(msg) {
                  console.log('message:', msg);
                });
        }

        $scope.findAllCompanies = function(symbol) {
        	// Show loader from service
        	LoaderService.show();

        	var promise = CompanyService.findAll(symbol);
            promise.then(
                function(company) {
                	var date = new Date(company.updateTmstmp);
                	company.updateTmstmp = date.toString();
                	$scope.company = company;
                	$scope.properties = company.properties;
                	if($scope.company.change > 0.2) {
                		$scope.trackerImg = "up.png";
                	} else if($scope.company.change < -0.2) {
                		$scope.trackerImg = "stock_index_down.png";
                	} else {
                		$scope.trackerImg = "button_minus_blue.png";
                	}

                	$scope.getStockRatings();
                	LoaderService.hide();
                }
                ,function(reason) {
                	alert('Failed: ' + reason);
                }
            );
        }

    });