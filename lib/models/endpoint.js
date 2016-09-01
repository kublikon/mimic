/*
-- Model for endpoint
-- This is used for storing simulated endpoints.
*/

(function (){

	var log = require('../console'),
		mongoose = require('mongoose'),
		schema = mongoose.Schema,
		config = require('../config'),
		db = mongoose.connection,
		model = {};

	model = mongoose.model('endpoint', {
		name: String,
		is_active: { type: Boolean },
		type: { type: String, enum: ['get', 'post', 'delete'] },
		path: String,
		response_type: { type: String, enum: ['success', 'fail', 'error', 'random', 'condition'] },
		success_response: String,
		fail_response: String,
		error_response: String,
		count_success: { type: Number, default:0 },
		count_fail: { type: Number, default:0 },
		count_error: { type: Number, default:0 },
		created_at: { type: Date, default: Date.now }
	});

	module.exports = model;

})();