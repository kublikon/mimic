window.app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 
    function($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);

        $stateProvider

        // welcome
        .state('endpoints', {
            url: '/',
            params: {},
            views: { 
                'main': { 
                    controller: 'endpointsCtrl',
                    templateUrl: 'views/endpoints.html'
                }
            }
        })
        .state('modal', {
            url: '/edit',
            params: { endpoint: {} },
            views: { 
                'main': { 
                    controller: 'endpointsCtrl',
                    templateUrl: 'views/endpoints.html'
                },
                'modal': {
                    controller: 'editCtrl',
                    templateUrl: 'views/edit.html'
                }
            }
        })
    
    }
]);