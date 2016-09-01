/*
-- Service for static files:
--
-- Note: should be first declared service.
*/

(function(){

	var log = require('../console'),
		config = require('../config'),
		parseFiles = require('../utils/parse-files'),
		assets = require('../../assets/main.json'),
		base_cache = '',
		icons_cache = '',
		main_cache = '';

	module.exports = function(app){

		log('i', 'static service started');

		// cache files

		parseFiles(app, 'css/base.css', function(res_file){
			base_cache = res_file.toString();
		});

		parseFiles(app, assets.scripts, function(res_file){
			main_cache = res_file.toString();
		});

		// cache css/js

       	app.get('/cache/base.css', function(req, res){

            log('d', 'getting compressed ustyme.css');

            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(base_cache);
        });

	    app.get('/cache/main.min.js', function(req, res){

            log('d', 'getting compressed main.min.js');

            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(main_cache);
        });
	};

})();