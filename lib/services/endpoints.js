/*
-- Service for dynamic endpoints.
--
*/

(function(){

	var log = require('../console'),
		config = require('../config'),
		endpoints = require('../logic/endpoints');

	module.exports = function(app, express){

		log('i', 'endpoint service started');

		endpoints.generate(app, express);
	};

})();