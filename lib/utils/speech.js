/*
-- Service for assisting with speech.
-- list - for creating a gramatical list
*/

(function(){

	var log = require('../console'),
		nlp = require('nlp_compromise');

	module.exports = {
		list: function(message, terms){

			var message = message + ' ',
				count = terms.length;

			terms.forEach(function(term, index){

				var separator = ', ',
					end = '';

				if(index == count - 2){
					separator = ' and ';
				}

				if(index == count - 1){
					separator = '';
					end = '.';
				}

				message += term.action + ' ' + nlp.noun(term.target).pluralize() + separator + end;
			});
			
			return message;
		},
		
	};

})();