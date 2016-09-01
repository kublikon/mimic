/*
-- Logic for long term tracking.
-- track
-- monitor
-- watch
*/

(function(){

	var log = require('../console'),
		db = require('../database'),
		check = require('../utils/check'),
		utils = require('../utils/utils');
		
	module.exports = {
		generate: function(app, express){

			db.endpoint.find({ is_active: true }, function(err, endpoint_data){

				if(err){

					log('e', err);

				} else if(endpoint_data.length == 0){

					log('d', 'no endpoints found');

				} else {

					function _success(endpoint_update, res){

						endpoint_update.count_success++;

						_update(endpoint_update);

						res.end(endpoint_update.success_response);
					};

					function _fail(endpoint_update, res){

						endpoint_update.count_fail++;

						_update(endpoint_update);

						res.end(endpoint_update.fail_response);	
					};

					function _error(endpoint_update, res){

						endpoint_update.count_error++;

						_update(endpoint_update);

						res.end(endpoint_update.error_response);
					};

					function _update(endpoint_update){
						endpoint_update.save(function(err){

							if(err){
								log('e', err);
							}
						});
					};

					endpoint_data.forEach(function(endpoint){

						app[endpoint.type](endpoint.path, function(req, res, next){

							// its important to do another lookup
							db.endpoint.findOne({ name: endpoint.name }, function(err, endpoint_update){

								if(!endpoint_update || (endpoint_update && !endpoint_update.is_active)){
									return next();
								}

								log('d', endpoint.name + ' hit');

								switch(endpoint_update.response_type){
									case 'success':

										_success(endpoint_update, res);

										break;
									case 'fail':

										_fail(endpoint_update, res);

										break;
									case 'error':

										_error(endpoint_update, res);

										break;
									case 'random':

										var random = Math.floor((Math.random() * 3) + 1);

										if(random == 1){
											_success(endpoint_update, res);
										} else if(random == 2){
											_fail(endpoint_update, res);
										} else if(random == 3){
											_error(endpoint_update, res);
										}

										break; 
									case 'condition':

										break;
								}
							});
						});
					});
				}
			});
		}
	}

})();