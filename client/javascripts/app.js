var jargoApp = angular.module('jargoApp', ['ui.router', 'ui.materialize', 'leaflet-directive']);

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


jargoApp.controller('FlatsController', ($scope, $location, $http) => {
  $scope.formData = {};
  $scope.newsList = {};
  // Get all flats
  $http.get('/api/v1/flats')
  .success((data) => {
    $scope.flatsList = data;
		var m1 = {
					lat: parseFloat($scope.flatsList[0].lat),
					lng: parseFloat($scope.flatsList[0].lng),
					focus: false,
					draggable: false,
					message: "Комендантский",
				};
				
		$scope.map = {
			defaults: {
				scrollWheelZoom: false
			},
			peterburg: {
				lat: 60.0387459481955,
				lng: 30.2280235290527,
				zoom: 15
			},
			center: {
				autoDiscover: true
			},
      layers: {
        baselayers: {
            osm: {
                name: 'OpenStreetMap',
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz'
            }
        }
      },
			markers:  {
				m1
			},
			events: {
				markers: {
				  enable: [ 'dragend' ]
				}
			}
		};
		
    $scope.removeMarkers = function(e) {
      e.preventDefault();
      $scope.map.markers = {};
      console.log("markers", $scope.map.markers);
    }

		$scope.myPan = function(e, lat, lng) {
			e.preventDefault(e);
			$scope.map.center.lat = lat; 
			$scope.map.center.lng = lng;
			$scope.map.center.zoom = 14;
      console.log("markers", $scope.map.markers);
		}
		
		/* $scope.$on("centerUrlHash", function(event, centerHash) {
			console.log("url", centerHash);
			$location.search({ c: centerHash });
		});
		
		$scope.changeLocation = function(centerHash) {
			$location.search({ c: centerHash });
		};
		 */
		angular.extend($scope, $scope.map);
		console.log(data);
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
    console.log(data);
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
    console.log(data);
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
