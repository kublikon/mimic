/*
-- Starting mongo service and combine models
*/

(function(){

	var log = require('./console'),
		mongoose = require('mongoose'),
		config = require('./config'),
		db = mongoose.connection,

		model = {};

	mongoose.connect(config.main.mongo_path);

	db.once('open', function(){
		log('i', 'mongo connection started');
	});

	db.on('error', function(){
		log('e', 'connection failed');
	});

	model = {
		endpoint: require('./models/endpoint')
	}

	module.exports = model;

})();