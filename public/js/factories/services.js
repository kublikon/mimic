app.factory('service', function($rootScope, $http, $location){
	return {
		get: function(path, data, cb){
			
			var id = (data.id)? '/' + data.id : '';

			$http.get(window.main.domain + '/' + path + id, { params: data })
			.success(function(ret){
				if(ret.error && ret.error.code == 403){
					// logout
				} else {
					cb(ret);
				}
			})
			.error(function(ret){
				console.log('error', ret);
			});
		},
		post: function(path, data, cb){
			
			$http.post(window.main.domain + '/' + path, data)
			.success(function(ret){
				if(ret.error && ret.error.code == 403){
					// logout
				} else {
					cb(ret);
				}
			})
			.error(function(ret){
				console.log('error', ret);
			});
		},
		delete: function(path, data, cb){
			
			$http.delete(window.main.domain + '/' + path, data)
			.success(function(ret){
				if(ret.error && ret.error.code == 403){
					// logout
				} else {
					cb(ret);
				}
			})
			.error(function(ret){
				console.log('error', ret);
			});
		},
		validate: function(model, id, type){
			
			if(!model || model == ' ' || model.length == 0){				
				if($('#missing-' + id).length == 0){
					var item = $('#' + id),
						position = $('#' + id).position();
					
					item.addClass('b-required');

					if(type == 'img'){
					} else if(type == 'text'){
					} else if(type == 'select'){
						position.right = 'right: 32px;';
					} else if(type == 'textarea'){
					}
					
					$('#' + id).after('<span style="' + position.right + '" class="b-missing" id="missing-' + id + '">missing</span>');
				}

				return 1;
			} else {
				$('#' + id).removeClass('b-required');
				$('#missing-' + id).remove();

				return 0;
			}
		},
		clearValidation: function(){

			$('.b-required').removeClass('b-required');
			$('.b-missing').remove();
		}
	};
});