(function(){

    var log = require('./lib/console'),
        config = require('./lib/config'),
        cluster = require ('cluster'),
        os = require('os'),
        cpus = os.cpus(),
        num_cpus = cpus.length,
        master = require('./lib/server/master'),
        worker = require('./lib/server/worker'),

        options = {
            cluster: cluster,
            os: os,
            cpus: cpus,
            num_cpus: num_cpus,
            dirname: __dirname,
        };

    if(cluster.isMaster){
        master(options);
    } else {
        worker(options);
    }

})();