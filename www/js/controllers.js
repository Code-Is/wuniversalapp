angular.module('starter.controllers', [])




    .filter('htmlToPlaintext', function () {
        return function (text) {
            return String(text).replace(/<[^>]+>/gm, '');
        }
    }
)

    .controller('networkController', function ($scope, $ionicPopup, $timeout) {

        document.addEventListener("offline", function () {

            $scope.showConfirm = function () {
                var confirmPopup = $ionicPopup.alert({
                    title: 'Erro de conexão com a rede',
                    template: 'verifique a configuração com a internet'
                });
                confirmPopup.show();
            };

            setTimeout('confirmPopup.hide()', 8000);

        }, false);

        document.addEventListener("online", function () {

        });



    })

    .controller(Storage.prototype.setObject = function (key, value) {

        this.setItem(key, JSON.stringify(value));
    })

    .controller(Storage.prototype.getObject = function(key) {
        var value = this.getItem(key);
        return value && JSON.parse(value);
    })

    .controller('menuController', ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {

        $scope.menuAPI = 'http://hibrido.codeis.com.br/api/get_category_index';
        $scope.menuItems = [];
        $scope.isFetchingMenu = true;

        $scope.pullContent = function () {

            $http.jsonp($scope.menuAPI + '/?callback=JSON_CALLBACK').success(function (response) {

                $scope.menuItems = $scope.menuItems.concat(response.categories);
                window.localStorage.setObject('rootsMenu', $scope.menuItems); // we save the posts in localStorage
                window.localStorage.setItem('rootsMenuDate', new Date());

                $scope.isFetchingMenu = false;

            });

        };

        $scope.showCategory = function (index) {

            $rootScope.categoryID = $scope.menuItems[index];
            $scope.menu.setMainPage('category.html', {closeMenu: true});

        };


        if (window.localStorage.getItem("rootsMenuDate") != null && window.localStorage.getObject("rootsMenu") != null) {

            var now = new Date();
            var saved = new Date(window.localStorage.getItem('rootsMenuDate'));

            var difference = Math.abs(now.getTime() - saved.getTime()) / 3600000;

            if (difference > 12) {

                window.localStorage.removeItem('rootsMenu');
                window.localStorage.removeItem('rootsMenuDate');

                $scope.pullContent();

            } else {

                $scope.menuItems = window.localStorage.getObject('rootsMenu');
                $scope.isFetchingMenu = false;

            }

        } else {

            $scope.pullContent();

        }


    }])


    .controller('categoryController', ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {

        $scope.category = $rootScope.categoryID;
        $scope.categoryID = $rootScope.categoryID.id;
        $scope.catPrefix = 'cat' + $scope.categoryID;

        $scope.catAPI = 'http://hibrido.codeis.com.br/api/get_category_posts/?id=' + $scope.categoryID;
        $scope.catItems = [];
        $scope.catTotalPages = 0;
        $scope.catCurrentPage = 1;
        $scope.catPageNumber = 1;
        $scope.isFetching = true;
        $scope.lastSavedPage = 0;

        $scope.imgLoadedEvents = {
            done: function (instance) {
                angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
            }
        };

        $scope.pullContent = function () {

            $http.jsonp($scope.catAPI + '&page=' + $scope.catPageNumber + '&callback=JSON_CALLBACK').success(function (response) {

                if ($scope.catPageNumber > response.pages) {

                    $('#moreButton[rel=' + $scope.catPrefix + ']').fadeOut('fast');

                } else {

                    $scope.catItems = $scope.catItems.concat(response.posts);
                    window.localStorage.setObject('rootsPosts' + $scope.catPrefix, $scope.catItems); // we save the posts in localStorage
                    window.localStorage.setItem('rootsDate' + $scope.catPrefix, new Date());
                    window.localStorage.setItem("rootsLastPage" + $scope.catPrefix, $scope.catCurrentPage);
                    window.localStorage.setItem("rootsTotalPages" + $scope.catPrefix, response.pages);


                    $scope.catTotalPages = response.pages;
                    $scope.isFetching = false;

                    if ($scope.catPageNumber == response.pages) {

                        $('#moreButton[rel=' + $scope.catPrefix + ']').fadeOut('fast');

                    }

                }

            });

        }

        $scope.showPost = function (index) {

            $rootScope.postContent = $scope.catItems[index];
            $scope.ons.navigator.pushPage('post.html');

        };

        $scope.nextPage = function () {

            $scope.catCurrentPage++;
            $scope.catPageNumber = $scope.catCurrentPage;
            $scope.getAllRecords($scope.catPageNumber);

        }

        $scope.getAllRecords = function (catPageNumber) {

            $scope.isFetching = true;

            if (window.localStorage.getItem("rootsLastPage" + $scope.catPrefix) == null) {

                console.log('pulling content for the first time');
                $scope.pullContent();

            } else {

                var now = new Date();
                var saved = new Date(window.localStorage.getItem("rootsDate" + $scope.catPrefix));

                var difference = Math.abs(now.getTime() - saved.getTime()) / 3600000;

                if (difference > 24) {
                    $scope.catCurrentPage = 1;
                    $scope.catPageNumber = 1;
                    $scope.lastSavedPage = 0;
                    window.localStorage.removeItem("rootsLastPage" + $scope.catPrefix);
                    window.localStorage.removeItem("rootsPosts" + $scope.catPrefix);
                    window.localStorage.removeItem("rootsTotalPages" + $scope.catPrefix);
                    window.localStorage.removeItem("rootsDate" + $scope.catPrefix);
                    console.log('lets start over again with fresh content')
                    $scope.pullContent();

                } else {

                    $scope.lastSavedPage = window.localStorage.getItem("rootsLastPage" + $scope.catPrefix);
                    if ($scope.catCurrentPage > $scope.lastSavedPage) {

                        console.log('pulling new page content');
                        $scope.pullContent();
                    } else {

                        console.log('getting saved json');
                        $scope.catItems = window.localStorage.getObject('rootsPosts' + $scope.catPrefix);
                        $scope.catCurrentPage = $scope.lastSavedPage;
                        $scope.catTotalPages = window.localStorage.getItem("rootsTotalPages" + $scope.catPrefix);
                        $scope.isFetching = false;

                    }

                }

            }

        };

    }])

    .controller('newsController', ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {

        $scope.yourAPI = 'http://hibrido.codeis.com.br/api/get_recent_posts';
        $scope.items = [];
        $scope.totalPages = 0;
        $scope.currentPage = 1;
        $scope.pageNumber = 1;
        $scope.isFetching = true;
        $scope.lastSavedPage = 0;


        $scope.pullContent = function () {

            $http.jsonp($scope.yourAPI + '/?page=' + $scope.pageNumber + '&callback=JSON_CALLBACK').success(function (response) {

                if ($scope.pageNumber > response.pages) {

                    $('#moreButton[rel=home]').fadeOut('fast');

                } else {

                    $scope.items = $scope.items.concat(response.posts);
                    window.localStorage.setObject('rootsPostsHome', $scope.items); // we save the posts in localStorage
                    window.localStorage.setItem('rootsDateHome', new Date());
                    window.localStorage.setItem("rootsLastPageHome", $scope.currentPage);
                    window.localStorage.setItem("rootsTotalPagesHome", response.pages);

                    $scope.totalPages = response.pages;
                    $scope.isFetching = false;

                    if ($scope.pageNumber == response.pages) {

                        $('#moreButton[rel=home]').fadeOut('fast');

                    }

                }

            });

        };

        $scope.getAllRecords = function (pageNumber) {

            $scope.isFetching = true;

            if (window.localStorage.getItem("rootsLastPageHome") == null) {

                $scope.pullContent();

            } else {

                var now = new Date();
                var saved = new Date(window.localStorage.getItem("rootsDateHome"));

                var difference = Math.abs(now.getTime() - saved.getTime()) / 3600000;

                if (difference > 24) {

                    $scope.currentPage = 1;
                    $scope.pageNumber = 1;
                    $scope.lastSavedPage = 0;
                    window.localStorage.removeItem("rootsLastPageHome");
                    window.localStorage.removeItem("rootsPostsHome");
                    window.localStorage.removeItem("rootsTotalPagesHome");
                    window.localStorage.removeItem("rootsDateHome");

                    $scope.pullContent();

                } else {

                    $scope.lastSavedPage = window.localStorage.getItem("rootsLastPageHome");

                    if ($scope.currentPage > $scope.lastSavedPage) {

                        $scope.pullContent();
                    } else {

                        $scope.items = window.localStorage.getObject('rootsPostsHome');
                        $scope.currentPage = $scope.lastSavedPage;
                        $scope.totalPages = window.localStorage.getItem("rootsTotalPagesHome");
                        $scope.isFetching = false;

                    }

                }

            }

        };

        $scope.imgLoadedEvents = {
            done: function (instance) {
                angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
            }
        };

        $scope.showPost = function (index) {


            $rootScope.postContent = $scope.items[index];
            $state.go('post.html');

        };

        $scope.nextPage = function () {

            $scope.currentPage++;
            $scope.pageNumber = $scope.currentPage;
            $scope.getAllRecords($scope.pageNumber);

        }

    }])

    .controller('postController', ['$scope', '$rootScope', '$sce', function ($scope, $rootScope, $sce) {

        $scope.item = $rootScope.postContent;

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        $scope.imgLoadedEvents = {
            done: function (instance) {
                angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
            }
        };

    }]);


