/*
-- Utils
*/

(function(){

	var log = require('../console'),
		nlp = require('nlp_compromise');

	module.exports = (function(){
		
		Array.prototype.safeForEach = function(cb){
			
			if(this instanceof Array){
				
				if(this.length > 0){
					
					this.forEach(function(item, index){
						return cb(item, index);
					});
				} else {
					log('w', 'empty array');
				}
			} else {
				log('w', 'not an array');
			}
		};

		Array.prototype.toResponse = function(){
			
			var count = this.length;

			return this[Math.floor((Math.random() * count) + 0)];
		};

		Array.prototype.toScale = function(scale){
				
			var mood = null;

			if(scale < -20){
				mood = 0;
			} else if(scale < -10){ 
				mood = 1;
			} else if(scale < 10){
				mood = 2;
			} else if(scale < 20){
				mood = 3;
			} else {
				mood = 4;
			}

			var count = this[mood].length;

			return this[mood][Math.floor((Math.random() * count) + 0)];
		};

		Array.prototype.toText = function(){

			var self = this,
				text = '';

			self.forEach(function(term, index){
				text += term.normal + ((index == self.length - 1)? '': ' ');
			});

			return text;
		};

		Array.prototype.toList = function(){

			var text = '',
				count = this.length;

			this.forEach(function(term, index){

				var separator = ', ',
					end = '';

				if(index == count - 2){
					separator = ' and ';
				}

				if(index == count - 1){
					separator = '';
				}

				text += term.name + separator; //nlp.noun(term.name).pluralize() + separator;
			});
			
			return text;
		};

		Date.prototype.getPassed = function(){

			var res = null,
				time = new Date(this),
				current_time = new Date(),
				diff = current_time.valueOf() - time.valueOf(),
				hours = (diff/1000/60/60 >= 1)? parseInt(diff/1000/60/60) + ' hours ': '',
				minutes = ((diff/1000/60) >= 1 && (diff/1000/60) <= 60)? parseInt(diff/1000/60) + ' minutes ' : '',
				sec = ((diff/1000) >= 1 && (diff/1000) <= 60)? parseInt(diff/1000) + ' seconds': '';

			res = hours + minutes + sec;

			return res;
		};

		Number.prototype.plural = function(){

			if(this == 0){
				return 's';
			} else if(this == 1){
				return '';
			} else {
				return 's';
			}
		};

	})();

})();