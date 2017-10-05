var jargoApp = angular.module('jargoApp', ['ui.router', 'ui.materialize', 'leaflet-directive']);

jargoApp.config(function($stateProvider, $urlRouterProvider) {
    
    //$urlRouterProvider.otherwise('/studio');
    
    $stateProvider
		.state('studio', {
            url: '/studio',
            templateUrl: 'studio.html'
        })
		.state('euro-double', {
            url: '/euro-double',
            templateUrl: 'euro-double.html'
        })
		.state('euro-triple', {
            url: '/euro-triple',
            templateUrl: 'euro-triple.html'
        });
});

jargoApp.controller('ListController', function ($scope) {

	$scope.select = {
		value: "Option1",
		choices: ["Общая площадь: 26,47 кв. м", "с/у: совм.", "коридор: 3,29 кв.м", "балкон: 6,22 кв.м"]
	}
});


jargoApp.controller('FlatsController', ($scope, $http) => {
  $scope.formData = {};
  $scope.newsList = {};
  // Get all flats
  $http.get('/api/v1/flats')
  .success((data) => {
    $scope.flatsList = data;
	var m1 = 
			{
				lat: parseFloat($scope.flatsList[0].lat),
				lng: parseFloat($scope.flatsList[0].lng),
				focus: false,
				draggable: false,
				message: "test1",
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
			markers:  {
				m1
			},
			events: {
				markers: {
				  enable: [ 'dragend' ]
				}
			}
		};
		
		angular.extend($scope, $scope.map);
    console.log(data);
  })
  .error((error) => {
    console.log('Error: ' + error);
  });
});

jargoApp.controller('NewsController', function ($scope, $http) {
	$http.get("http://localhost:5000/json/news.json").then(function(response) {
		$scope.newsList = response.data;
		console.log("newslist", response.data);
	});
});

/* jargoApp.controller('NewsController2', ($scope, $http) => {
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
 */
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
