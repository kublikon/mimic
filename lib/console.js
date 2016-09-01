/*
 -- Thi module is for formatting console log statements to a predictible
 -- pattern. Preferred use is through 'log()' to prevent overwriting default
 -- methods.

 -- e - error
 -- w - warning
 -- i - info
 -- d - debug
 -- de - detail
 -- wtf - bad stuff
 */

(function(){

    var colors = require('colors'),
        pid = process.pid;

    function log(type){

        if(arguments.length > 0){

            for(var i = 0; i < arguments.length; i++){

                if(i > 0){
                    switch(type){
                        case 'e':
                            console.log('   error -'.red, ((pid == null)? '': pid + ' -'), arguments[i]);
                            break;
                        case 'w':
                            console.log('   warn  -'.magenta, ((pid == null)? '': pid + ' -'), arguments[i]);
                            break;
                        case 'i':
                            console.log('   info  -'.cyan, ((pid == null)? '': pid + ' -'), arguments[i]);
                            break;
                        case 'd':
                            console.log('   debug -'.grey, ((pid == null)? '': pid + ' -'), arguments[i]);
                            break;
                        case 'wtf':
                            console.log('   wtf?  -'.red, ((pid == null)? '': pid + ' -'), arguments[i] + ' \n \n   note: you fucked up, remember to breathe then check your shit! \n');
                            break;
                    }
                }
            }
        }
    };

    module.exports = log;

})();