function editCtrl($scope, $state, $stateParams, service){

	function bind(){

		$scope.endpoint = $stateParams.endpoint;
	};

	$scope.update = function(){

		var params = {
			name: $scope.endpoint.name,
			is_active: $scope.endpoint.is_active,
			response_type: $scope.endpoint.response_type,
			success_response: $scope.endpoint.success_response,
			fail_response: $scope.endpoint.fail_response,
			error_response: $scope.endpoint.error_response
		};

		service.post('api/update', params, function(res){

			$state.go('endpoints');
		});
	};

	$scope.clear = function(endpoint){

		service.post('api/clear', { name: endpoint.name }, function(res){

			$state.go('endpoints');
		});
	};

	$scope.remove = function(endpoint){

		service.post('api/remove', { name: endpoint.name }, function(res){

			$state.go('endpoints');
		});
	};

	bind();
}