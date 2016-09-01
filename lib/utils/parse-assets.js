/*
-- Extracts file names and loads template content. Also, it changes assets if compressed.
*/

(function(){

	var log = require('../console'),
		config =  require('../config'),
		path = require('path'),
		fs = require('fs');

	module.exports = function(app, view, asset_lists, cb){

		var res_view = null,
			res_assets = null;
 
		function processView(){

			// get view
			fs.readFile(app.options.dirname + '/views/' + view + '.ejs', 'utf8', function(err, content) {
				if(err){
					log('e', 'unable to read view file: ' + err);
				} else {
					res_view = content;

					return cb(res_view, res_assets);
				}
			});
		};

		if(config.main.compression){
			res_assets = require('../../assets/' + asset_lists.mini);
		} else {
			res_assets = require('../../assets/' + asset_lists.max);
		}

		processView();
	};
})();