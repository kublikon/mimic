/*
-- Service for static pages/assets:
-- get status, get index
--
-- Note: should be last declared service.
*/

(function(){

	var log = require('../console'),
		config = require('../config'),
		ejs = require('ejs'),
		minify = require('html-minifier').minify,
		parseAssets = require('../utils/parse-assets'),
		index_cache = null;

	module.exports = function(app){

		log('i', 'static views service started');

		// cache assets

	    parseAssets(app, 'index', { max: 'main.json', mini: 'main.min.json' }, function(view, assets){
			index_cache = ejs.render(view, assets);

			if(config.main.compression){
				index_cache = minify(index_cache, { 
					collapseWhitespace: true, 
					removeComments: true, 
					removeTagWhitespace:true, 
					customAttrSurround: [[ /\{\{#if\s+\w+\}\}/, /\{\{\/if\}\}/ ],[ /\{\{#unless\s+\w+\}\}/, /\{\{\/unless\}\}/ ]] 
				});
			}
	    });
	
		// view routes
  		
		app.get('/', function(req, res){

            log('d', 'url: ' + req.url);

            res.end(index_cache);
        });

        app.get('/edit', function(req, res){

            log('d', 'url: ' + req.url);

            res.end(index_cache);
        });
	};

})();