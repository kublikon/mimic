function endpointsCtrl($scope, service){

	function get(){

		service.get('api/settings', {}, function(res){

			bind(res);
		});
	};

	function bind(data){

		if(!data.error){

			$scope.endpoints = data;
			$scope.total_hits = 0;
			$scope.total_pass = 0;
			$scope.total_fail = 0;
			$scope.total_error = 0;

			data.forEach(function(endpoint){

				$scope.total_hits += endpoint.count_success + endpoint.count_fail + endpoint.count_error;
				$scope.total_pass += endpoint.count_success;
				$scope.total_fail += endpoint.count_fail;
				$scope.total_error += endpoint.count_error;
			});

		} else {

			$scope.endpoints = [];
		}
	};

	function clear(){

		$scope.name = '';
		$scope.is_active = false;
		$scope.type = '';
		$scope.path = '';
		$scope.response_type = '';
		$scope.success_response = '';
		$scope.fail_response = '';
		$scope.error_response = '';
	};

	$scope.refresh = function(){

		get();
	};

	$scope.add = function(){

		var element = $('#edit'),
			btn = $('#add-btn');
  
  		if(element.hasClass('on')){
  			element.removeClass('on');
  			btn.removeClass('fa-minus').addClass('fa-plus');

  			clear();
		} else {
			element.addClass('on');
			btn.removeClass('fa-plus').addClass('fa-minus');
		}
	};

	$scope.save = function(){

		var params = {
			name: $scope.name,
			is_active: true,
			type: $scope.type,
			path: $scope.path,
			response_type: $scope.response_type,
			success_response: $scope.success_response,
			fail_response: $scope.fail_response,
			error_response: $scope.error_response
		};

		console.log(params);

		service.post('api/settings', params, function(res){

			clear();
			get();
		});

	};

	$scope.activate = function(endpoint){

		service.post('api/activate', { name: endpoint.name }, function(res){

			get();
		});
	};

	$scope.remove = function(endpoint){

		service.post('api/remove', { name: endpoint.name }, function(res){

			get();
		});
	};

	get();
}