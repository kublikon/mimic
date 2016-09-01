/*
-- Service for executing actions against a node.
*/

(function(){

	var log = require('../console'),
		db = require('../database');

	module.exports = {
		exec: function(query, core, cb){

			db.node.findOne({ type: 'computer' }, function(err, node_data){

				if(err){

					return cb({ error: 'no nodes available' });

				} else if(!node_data){

					return cb({ error: 'no nodes available' });

				} else {

					query.token = node_data.token;

					if(core.app.wss.clients.length > 0){
						
						core.app.wss.clients.forEach(function(client){

							if(client.id == node_data.client_order){
								client.send(JSON.stringify(query));
							}
						});
					}

					return cb();
				}
			});		
		}
	};

})();