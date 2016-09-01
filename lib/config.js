/*
-- This module reads the configuration file for this project. When
-- config file is not found default properties are set.
*/

(function(){

    try {
        var log = require('./console'),
            fs = require('fs'),
            root = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
            config = undefined;

        if (fs.existsSync(root + '/.mimic.json')) {
            config = require(root + '/.mimic.json');

            log('i', 'using local configuration file');
        } else {
            config = require('../configs/dev.config.json');

            log('i', 'using internal configuration file');
        }

        // for passing config to client-side
        config.client = {
            
        };
        
        module.exports = config;
    } 
    catch(e) {
        var log = require('./console');

        log('e', e);
        log('e', 'config file is missing. Please insert dev.config.json config in the configs folder or .mimic.json in the root user folder.');

        process.exit(1);
    }
})();
