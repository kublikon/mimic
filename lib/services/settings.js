/*
-- Service for updating settings:
*/

(function(){

	var log = require('../console'),
		config = require('../config'),
		db = require('../database'),
		check = require('../utils/check'),
		endpoints = require('../logic/endpoints');

	module.exports = function(app){

		log('i', 'settings service started');
	
		// view routes
  		
		app.get('/api/settings', function(req, res){

            log('d', 'getting settings');

            db.endpoint.find({})
			.exec(function(err, endpoint_data){
				
				if(err){
					res.end(check.error('Unable to get endpoints', 'endpoints', 234));
				} else {
					res.end(check.validate(endpoint_data, 'endpoints'));
				}
			});
        });

        app.post('/api/settings', function(req, res){

        	log('d', 'creating endpoint setting');

        	if(!check.input(req, res, db, 'endpoints', ['name', 'type'])){
	    		return false;
	    	}

			var endpoint = new db.endpoint({
				name: req.body.name,
				is_active: req.body.is_active,
				type: req.body.type,
				path: req.body.path,
				response_type: req.body.response_type,
				success_response: req.body.success_response,
				fail_response: req.body.fail_response,
				error_response: req.body.error_response
			});

			endpoint.save(function(err, endpoint_data){

				var res_data = {};

				if(err){
					res.end(check.error('Unable to save endpoint', 'endpoints', 234));
				} else {
					res_data.endpoint = endpoint_data;

					endpoints.generate(app);

					res.end(check.validate(res_data, 'endpoint'));
				}

			});
        });

        app.post('/api/update', function(req, res){

        	log('d', 'update endpoint');

        	db.endpoint.findOne({ name: req.body.name }, function(err, endpoint_data){

        		if(err){
        			res.end(check.error('Unable to update endpoint', 'endpoints', 234));
        		} else {

        			endpoint_data.is_active = req.body.is_active;
        			endpoint_data.response_type = req.body.response_type;
        			endpoint_data.success_response = req.body.success_response;
        			endpoint_data.fail_response = req.body.fail_response;
        			endpoint_data.error_response = req.body.error_response;

        			endpoint_data.save(function(err){

        				if(err){
        					res.end(check.error('Unable to update endpoint', 'endpoints', 234));
        				} else {

        					endpoints.generate(app);

        					res.end(check.log('updated', 'endpoints', 200));
        				}
        			});
        		}
        	});
        });

        app.post('/api/clear', function(req, res){

        	log('d', 'clear stats in endpoint');

        	db.endpoint.findOne({ name: req.body.name }, function(err, endpoint_data){

        		if(err){
        			res.end(check.error('Unable to update endpoint', 'endpoints', 234));
        		} else {

        			endpoint_data.count_success = 0;
					endpoint_data.count_fail = 0;
					endpoint_data.count_error = 0;

        			endpoint_data.save(function(err){

        				if(err){
        					res.end(check.error('Unable to update endpoint', 'endpoints', 234));
        				} else {

        					endpoints.generate(app);

        					res.end(check.log('updated', 'endpoints', 200));
        				}
        			});
        		}
        	});
        });

        app.post('/api/activate', function(req, res){

        	log('d', 'activate endpoint');

        	db.endpoint.findOne({ name: req.body.name }, function(err, endpoint_data){

        		if(err){
        			res.end(check.error('Unable to update endpoint', 'endpoints', 234));
        		} else {

        			if(endpoint_data.is_active){
        				endpoint_data.is_active = false;
        			} else {
        				endpoint_data.is_active = true;
        			}

        			endpoint_data.save(function(err){

        				if(err){
        					res.end(check.error('Unable to update endpoint', 'endpoints', 234));
        				} else {

        					endpoints.generate(app);

        					res.end(check.log('updated', 'endpoints', 200));
        				}
        			});
        		}
        	});
        });

        app.post('/api/remove', function(req, res){

        	log('d', 'removing endpoint');

        	db.endpoint.remove({ name: req.body.name }, function(err){

        		if(err){
        			res.end(check.error('Unable to remove endpoint', 'endpoints', 234));
        		} else {

        			endpoints.generate(app);

        			res.end(check.log('removed', 'endpoints', 200));
        		}
        	});
        });
	};

})();