var jargoApp = angular.module('jargoApp', ['ui.router', 'ui.materialize', 'leaflet-directive']);

jargoApp.factory('PagerService', function() {
    return {
        GetPager: function(totalItems, currentPage, pageSize) {
          // default to first page
          currentPage = currentPage || 1;
   
          // default page size is 24
          pageSize = pageSize || 24;
   
          // calculate total pages
          var totalPages = Math.ceil(totalItems / pageSize);
   
          var startPage, endPage;
          if (totalPages <= 10) {
              // less than 10 total pages so show all
              startPage = 1;
              endPage = totalPages;
          } else {
              // more than 10 total pages so calculate start and end pages
              if (currentPage <= 6) {
                  startPage = 1;
                  endPage = 10;
              } else if (currentPage + 4 >= totalPages) {
                  startPage = totalPages - 9;
                  endPage = totalPages;
              } else {
                  startPage = currentPage - 5;
                  endPage = currentPage + 4;
              }
          }
   
          // calculate start and end item indexes
          var startIndex = (currentPage - 1) * pageSize;
          var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
   
          // create an array of pages to ng-repeat in the pager control
          /*function range(start, count) {
            return Array.apply(0, Array(count))
              .map(function (element, index) { 
                return index + start;  
            });
          }*/

          var pages = Array.from(Array(startPage + endPage + 1), (_, i) => startPage + i);
   
          // return object with all pager properties required by the view
          return {
              totalItems: totalItems,
              currentPage: currentPage,
              pageSize: pageSize,
              totalPages: totalPages,
              startPage: startPage,
              endPage: endPage,
              startIndex: startIndex,
              endIndex: endIndex,
              pages: pages
          };
            
        }
    }
});

jargoApp.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input.split(splitChar)[splitIndex];
    }
});

jargoApp.config(function($stateProvider, $urlRouterProvider) {
    
    //$urlRouterProvider.otherwise('/news');
    
    $stateProvider
		.state('news', {
            url: '/news',
            templateUrl: 'views/news.html'
        })
    .state('articles', {
            url: '/articles',
            templateUrl: 'views/articles.html'
        })
    .state('agents', {
            url: '/agents',
            templateUrl: 'views/agents.html'
        })
    .state('builders', {
            url: '/builders',
            templateUrl: 'views/builders.html'
        });
});

jargoApp.controller('ListController', function ($scope) {
	$scope.select = {
		value: "Option1",
		choices: ["Общая площадь: 26,47 кв. м", "с/у: совм.", "коридор: 3,29 кв.м", "балкон: 6,22 кв.м"]
	}
});

jargoApp.controller('FlatsController', ($scope, $location, $http, PagerService) => {
  PagerService.GetPager();

  $http.get('/api/v1/flats')
  .success((data) => {
    $scope.flatsList = data;
    console.log(data);

		$scope.map = {
			defaults: {
				scrollWheelZoom: false,
        zoom: 15
			},
			center: {
				autoDiscover: true
			}
		};

		angular.extend($scope, $scope.map);

    $scope.pager = {};
    $scope.setPage = setPage;
 
    initController();
 
    function initController() {
      // initialize to page 1
      $scope.setPage(1);
    }
 
    function setPage(page) {
    
      if (page < 1 || page > $scope.pager.totalPages) {
        return;
      } 

      // get pager object from service
      $scope.pager = PagerService.GetPager($scope.flatsList.length, page);

      // get current page of items
      $scope.flats = $scope.flatsList.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
    }

  })
  .error((error) => {
    console.log('Error: ' + error);
  });
});

/* jargoApp.controller('NewsController', function ($scope, $http) {
	$http.get("/json/news.json").then(function(response) {
		$scope.newsList = response.data;
		console.log("newslist", response.data);
	});
});
 */
 
jargoApp.controller('NewsController', ($scope, $http) => {
  $scope.formData = {};
  $scope.newsList = {};
  // Get all news
  $http.get('/api/v1/news')
  .success((data) => {
    $scope.newsList = data;
    //console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
});

jargoApp.controller('ArticlesController', ($scope, $http) => {
  $scope.formData = {};
  $scope.articlesList = {};
  // Get all articles
  $http.get('/api/v1/articles')
  .success((data) => {
    $scope.articlesList = data;
    //console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
});

jargoApp.controller('mainController', ($scope, $http) => {
  $scope.formData = {};
  $scope.todoData = {};
  // Get all todos
  $http.get('/api/v1/todos')
  .success((data) => {
    $scope.newsData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
  // Get all todos
  $http.get('/api/v1/todos')
  .success((data) => {
    $scope.todoData = data;
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
  // Create a new todo
  $scope.createTodo = () => {
    $http.post('/api/v1/todos', $scope.formData)
    .success((data) => {
      $scope.formData = {};
      $scope.todoData = data;
      console.log(data);
    })
    .error((error) => {
      console.log('Error: ' + error);
    });
  };
  // Delete a todo
  $scope.deleteTodo = (todoID) => {
    $http.delete('/api/v1/todos/' + todoID)
    .success((data) => {
      $scope.todoData = data;
      console.log(data);
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  };
});

