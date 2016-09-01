/*
-- Loads files into cache.
*/

(function(){

	var log = require('../console'),
		config =  require('../config'),
		jsp = require("uglify-js").parser,
		pro = require("uglify-js").uglify,
		fs = require('fs');

	module.exports = function(app, paths, cb){

		if(typeof paths == 'object'){

			var count = paths.length,
				contents = '';

			function read(path){
				fs.readFile(app.options.dirname + path, 'utf8', function(err, content) {
					--count;

					if(err){
						log('e', 'unable to read file: ' + err);
					} else {
						contents += content;
					}

					if(count == 0){
						compress(contents);
					}
				});
			};

			function compress(contents){
				
				// var ast = jsp.parse(contents);

				// ast = pro.ast_mangle(ast); 
				// ast = pro.ast_squeeze(ast); 
				// contents = pro.gen_code(ast);			

				return cb(contents);
			};

			paths.forEach(function(path){
				if(/kb-/i.test(path)){
					path = '/node_modules/kuba-bootstrap/' + path;
					read(path);
				} else {
					path = '/public/' + path;
					read(path);
				}
			});

		} else {

			fs.readFile(app.options.dirname + '/public/' + paths, 'utf8', function(err, content) {
				if(err){
					log('e', 'unable to read file: ' + err);
				} else {
					return cb(content);
				}
			});
		}

	};

})();