/*
-- Service for npm search.
*/

(function(){

	var log = require('../console');

	module.exports = (function(){

		// Array.prototype.analize = function(search){
			
		// 	var self = this,
		// 		order = 0,
		// 		stats = {},
		// 		res_data = {};

		// 	function _findStatement(){
			
		// 		self.forEach(function(term, index){

		// 			if(term.normal == 'to'){
		// 				res_data.statement = {};
		// 				res_data.statement.raw = self.splice(index + 1, self.length);
		// 				res_data.statement.text = res_data.statement.raw.toText();
		// 			}
		// 		});
		// 	};

		// 	function _findSubject(term, index){

		// 		if(term.tag == 'Organization'){

		// 			res_data.subject = term.normal;
		// 			res_data.raw_subject = term.text;

		// 		} else if(term.tag == 'Person' && term.normal != 'you'){

		// 			res_data.subject = term.normal;
		// 			res_data.raw_subject = term.text;

		// 		} else if(!res_data.subject && (index == self.length - 1)){

		// 			res_data.subject = term.normal;
		// 			res_data.raw_subject = term.text;
		// 		}
		// 	};

		// 	function _positionTerm(term, index){
				
		// 		if(index == 0){

		// 			term.is_first = true;

		// 		} else if(index == self.length - 1){
					
		// 			term.is_last = true;
		// 		}
		// 	};

		// 	function _addTerm(target, term, index){

		// 		var tag = target.tag.toLowerCase();

		// 		res_data[tag] = {};

		// 		res_data[tag].text = term.normal;
		// 		res_data[tag].raw = term.text;
		// 		res_data[tag].order = order;

		// 		_positionTerm(res_data[tag], index);
		// 		_incrementTerm(target, term, index);

		// 		order++
		// 	};

		// 	function _incrementTerm(target, term, index){

		// 		var tag = target.tag.toLowerCase();

		// 		if(!stats[tag]){
		// 			stats[tag] = 1;
		// 		} else {
		// 			stats[tag]++;
		// 		}

		// 		tag = tag + '_' + stats[tag];

		// 		res_data[tag] = {};

		// 		res_data[tag].text = term.normal;
		// 		res_data[tag].raw = term.text;
		// 		res_data[tag].order = order;

		// 		_positionTerm(res_data[tag], index);
		// 	};

		// 	function _findTerm(term, target, index){
				
		// 		if(term.tag == target.tag){

		// 			if(target.is && target.is == term.normal){

		// 				_addTerm(target, term, index);

		// 			} else if(target.not && target.not != term.normal){

		// 				_addTerm(target, term, index);

		// 			} else if(!target.is && !target.not){

		// 				_addTerm(target, term, index);
		// 			}
		// 		}

		// 		_findSubject(term, index);
		// 	};

		// 	if(self.length > 0 && search.length > 0){

		// 		self.forEach(function(term, index){
		// 			search.forEach(function(target){

		// 				_findTerm(term, target, index);

		// 			});
		// 		});

		// 		_findStatement();
		// 	}

		// 	res_data.count = order - 1;

		// 	return res_data;
		// };

		Array.prototype.analize = function(search){

			var self = this,
				found_pronoun = false,
				found_adjective = false,
				found_sub_subject = false,
				res_data = {
					command_type: 'statement',
					term_pattern: '',
					subject_pronoun: null,
					subject_adjective: null,
					subject: null,
					sub_subject: null,
					statement: null
				},
				statement_index = null;

			function _determineType(term){

				if(term.tag == 'Question'){
					res_data.command_type = 'question';
				}

			};

			function _findStatement(term, index){

				if(res_data.command_type != 'question' && term.tag == 'Copula' && term.normal == 'is'){

					res_data.statement = { text: '' };

					statement_index = index;	
				}

			};

			function _findSubSubject(term, index){

				if((term.pos.Verb || term.pos.Noun) && !found_sub_subject){

					found_sub_subject = true;

					res_data.sub_subject = {};
					res_data.sub_subject.text = term.normal;
					res_data.sub_subject.raw = term.text;
					res_data.sub_subject.grammar = { term: term.tag };

					if(self[index - 1] && self[index - 1].tag == 'Determiner'){
						res_data.sub_subject.grammar.determiner = self[index - 1].normal;
					}
				}
			};

			function _findSubject(term, index){

				if(term.tag == 'Organization'){

					res_data.subject = {};
					res_data.subject.text = term.normal;
					res_data.subject.raw = term.text;
					res_data.subject.grammar = { term: term.tag };

					if(self[index - 1] && self[index - 1].tag == 'Determiner'){
						res_data.sub_subject.grammar.determiner = self[index - 1].normal;
					}

				} else if(term.tag == 'Person' && term.normal != 'you'){

					res_data.subject = {};
					res_data.subject.text = term.normal;
					res_data.subject.raw = term.text;
					res_data.subject.grammar = { term: term.tag };

					if(self[index - 1] && self[index - 1].tag == 'Determiner'){
						res_data.sub_subject.grammar.determiner = self[index - 1].normal;
					}

				} else if(!res_data.subject && (index == self.length - 1)){

					res_data.subject = {};
					res_data.subject.text = term.normal;
					res_data.subject.raw = term.text;
					res_data.subject.grammar = { term: term.tag };

					if(self[index - 1] && self[index - 1].tag == 'Determiner'){
						res_data.sub_subject.grammar.determiner = self[index - 1].normal;
					}
				}
			};

			self.safeForEach(function(term, index){

				if((term.tag == 'Pronoun' || term.tag == 'Possessive') && !found_pronoun){

					found_pronoun = true;

					res_data.subject_pronoun = term.normal;
				}

				if(term.tag == 'Adjective'){

					found_adjective = true;

					res_data.subject_adjective = term.normal;
				}

				if(!statement_index && (term.tag == 'Noun' || term.tag == 'Verb' || term.tag == 'Infinitive')){
					term.tag = '*';
				}

				if(!statement_index){
					res_data.term_pattern += term.tag + ' ';
				} else {
					res_data.statement.text += term.normal + ' ';
				}

				_determineType(term);
				_findSubSubject(term, index);
				_findSubject(term, index);
				_findStatement(term, index);
			});

			return res_data;
		};	

	})();

})();