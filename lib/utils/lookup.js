/*
-- Service for lookup.
-- getCore - for getting short term memory and merging app
-- updateCore - for updating short term memory
-- getBehavior - for getting behavior based on npl pattern
*/

(function(){

	var log = require('../console'),
		db = require('../database'),
		rs = require('../../assets/responses');

	module.exports = {
		getCore: function(command, app, cb){

			var res_data = {};

			function _openMemoryShort(){

				db.memory_short.findOne({}, function(err, memory_short){

					var core = { app: app };

					if(err){

						res_data.status = false;
						res_data.message = rs.error.toResponse();

						return cb(res_data);

					} else if(!memory_short){

						var mem = new db.memory_short({});

						mem.save(function(err, memory_short){

							if(err){
								res_data.status = false;
								res_data.message = rs.error.toResponse();

								return cb(res_data);
							} else {

								core.memory_short = memory_short;

								if(command){
									_saveCommand(core);
								} else {
									return cb(core);
								}
							}
						});
					} else {

						core.memory_short = memory_short;

						if(command){
							_saveCommand(core);
						} else {
							return cb(core);
						}
					}
				});
			};

			function _saveCommand(core){

				var cm = new db.command({
					text: command
				});

				cm.save(function(err, cmd){

					if(err){

						res_data.status = false;
						res_data.message = rs.error.toResponse();

						return cb(res_data);

					} else {

						core.command = cmd;

						return cb(core);
					}
				});
			};

			_openMemoryShort();
		},
		updateCore: function(res_data, core){

			if(core.command && res_data.status){
				core.memory_short.mood++;
				core.command.status = true;
			} else if(core.command) {
				core.memory_short.mood--;
				core.command.status = false;
			}

			core.memory_short.last_response = res_data.message;

			core.memory_short.save(function(err){

				if(core.command){
					core.command.save(function(err){

						if(!res_data.no_reply){

							// TODO: find active output
							core.app.ws.send(JSON.stringify(res_data));
						}
					});
				} else {

					if(!res_data.no_reply){

						// TODO: find active output
						core.app.ws.send(JSON.stringify(res_data));
					}
				}
			});

		},
		getBehavior: function(query, cb){

			var res_data = {};

			db.behavior.findOne({ term_pattern: query.term_pattern, subject_pronoun: query.subject_pronoun }, function(err, behavior_data){

				if(err){

					log('e', core);

				} else if(!behavior_data){

					res_data = { query: query, patterns: [] };

				} else {

					var data = behavior_data.toJSON();

					res_data = { query: query, patterns: data.patterns };
				}

				return cb(res_data);
			});
		}
	};

})();