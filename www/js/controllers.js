angular.module('conFusion.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
        $scope.loginData = $localStorage.getObject('userinfo','{}');

    // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

    // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

    // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

    // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);
            $localStorage.storeObject('userinfo',$scope.loginData)
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };

        $scope.reservation = {};

        $ionicModal.fromTemplateUrl('templates/reserve.html',{
            scope: $scope
        }).then(function(modal){
            $scope.reserveform = modal;
        });

        $scope.closeReserve = function() {
            $scope.reserveform.hide();
        };

        $scope.reserve = function() {
            $scope.reserveform.show();
        };

        $scope.doReserve = function() {
            console.log('Doing reservation', $scope.reservation);
  
            $timeout(function() {
                $scope.closeReserve();
            }, 1000);
        };
    })

    .controller('MenuController', ['$scope', 'dishes', 'menuFactory','favoriteFactory','baseURL','$ionicListDelegate','$localStorage','$window', function($scope, dishes, menuFactory,favoriteFactory,baseURL,$ionicListDelegate,$localStorage,$window) {
        $scope.baseURL = baseURL;
        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;
        $scope.showMenu = false;
        $scope.message = "Loading ...";
        
        $scope.dishes = menuFactory.query(
            function(response) {
                $scope.dishes = response;
                $scope.showMenu = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            });
        console.log($scope.dishes);
                        
        $scope.select = function(setTab) {
            $scope.tab = setTab;
                
            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };
    
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };

        $scope.addFavorite = function (index) {
            console.log("index is " + index);
            favoriteFactory.addToFavorites(index);
//            console.log(favoriteFactory.favorites);
//            $localStorage.storeObject('favorites',favoriteFactory.favorites);
//            console.log($window.localStorage['favorit']);
            $ionicListDelegate.closeOptionButtons();
        };
    }])

    .controller('ContactController', ['$scope', function($scope) {

        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
        $scope.channels = channels;
        $scope.invalidChannelSelection = false;
                        
    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory','baseURL',function($scope,feedbackFactory,baseURL) {
        $scope.baseURL = baseURL;            
        $scope.sendFeedback = function() {
                
            console.log($scope.feedback);
                
            if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                feedbackFactory.save($scope.feedback);
                $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                $scope.feedback.mychannel="";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory','favoriteFactory','baseURL', '$ionicPopover', '$ionicModal', '$timeout',function($scope, $stateParams, dish, menuFactory,favoriteFactory,baseURL,$ionicPopover, $ionicModal, $timeout) {
        $scope.baseURL = baseURL;

        $scope.dish = dish
            .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );

        $scope.showDish = false;
        $scope.message="Loading ...";
/*
        $scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
            .$promise.then(
                function(response){
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
            );
*/
        $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html',{
            scope:$scope
        }).then(function(popover){
            $scope.popover=popover;
        });
        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        $scope.addFavorite = function () {
            console.log("index is " + $scope.dish.id);
            favoriteFactory.addToFavorites($scope.dish.id);
//                    $localStorage.storeObject('favorit',favoriteFactory.favorites);
            $scope.closePopover();
        };

        $scope.mycomment = {rating:5, comment:"", author:"", date:""};

        $ionicModal.fromTemplateUrl('templates/dish-comment.html',{
            scope: $scope
        }).then(function(modal){
            $scope.commentform = modal;
        });

        $scope.closeComment = function() {
            $scope.commentform.hide();
        };

        $scope.comment = function() {
            $scope.commentform.show();
        };

        $scope.doComment = function() {

            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);
                
            $scope.dish.comments.push($scope.mycomment);
            menuFactory.update({id:$scope.dish.id},$scope.dish);
                
//          $scope.commentForm.$setPristine();
                
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            $timeout(function() {
                $scope.closeComment();
            }, 1000);
        };
        $scope.addComment = function () {
            $scope.comment();
            $scope.closePopover();
        };

    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
            
        $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
        $scope.submitComment = function () {
                
            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);
                
            $scope.dish.comments.push($scope.mycomment);
            menuFactory.update({id:$scope.dish.id},$scope.dish);
                
            $scope.commentForm.$setPristine();
                
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
        }
    }])

        // implement the IndexController and About Controller here

    .controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'baseURL',function($scope, dish, promotion, leader,baseURL) {
        
        $scope.baseURL = baseURL;                
        $scope.leader = leader;

        $scope.showDish = false;
        $scope.message="Loading ...";

        $scope.dish = dish
        .$promise.then(
            function(response){
                $scope.dish = response;
                $scope.showDish = true;
            },
            function(response) {
                $scope.message = "Error: "+response.status + " " + response.statusText;
            }
        );

        $scope.promotion = promotion;
            
    }])

    .controller('AboutController', ['$scope', 'leaders', 'baseURL', function($scope, leaders, baseURL) {
        $scope.baseURL = baseURL;   
        $scope.leaders = leaders;
        console.log($scope.leaders);
            
    }])

    .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading' , '$timeout', '$localStorage','$window', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $localStorage,$window) {

        $scope.baseURL = baseURL;
        $scope.shouldShowDelete = false;
 //       console.log($window.localStorage['favorit']);
//        favorites = $localStorage.getObject('favorit','{}');
        $scope.favorites = favorites;
//        $scope.favorites = $localStorage.getObject('favorites','{}');
        $scope.dishes = dishes;

        console.log($scope.dishes, $scope.favorites);
//        $scope.favorites = $localStorage.getObject('favorites','{}');
        $scope.toggleDelete = function () {
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
            console.log($scope.shouldShowDelete);
        }

        $scope.deleteFavorite = function (index) {
        
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Delete',
                template: 'Are you sure you want to delete this item?'
            });

            confirmPopup.then(function(res){
                if(res){
                    console.log('OK to delete');
                    favoriteFactory.deleteFromFavorites(index);

                } else {
                    console.log('Canceled delete');
                }
                //$localStorage.storeObject('favorites',favorites);
            });
       
            $scope.shouldShowDelete = false;

        }
    }])

    .filter('favoriteFilter', function () {
        return function (dishes, favorites) {
            var out = [];
            for (var i = 0; i < favorites.length; i++) {
                for (var j = 0; j < dishes.length; j++) {
                    if (dishes[j].id === favorites[i].id)
                        out.push(dishes[j]);
                }
            }
            return out;
        }
    }
)
;