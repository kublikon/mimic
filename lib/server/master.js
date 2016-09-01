(function(){

    var log = require('../console'),
        config = require('../config');

    module.exports = function(options){

        var workers = [],
            worker_i = 0,
            clusters = [],
            pid = process.pid,
            core_limit = null,

            services_master = {
                // master_process: require('../services-master/master-process'),
                // worker_stats: require('../services-master/worker-stats'),
                // redis: require('../services-master/redis')
            };

        log('i', config.main.title + ' master started on port ' + config.main.port_master);

        // manage workers
        function spawnWorker(i){

            workers[i] = options.cluster.fork();
            clusters[i] = {};

            workers[i].on('exit', function(worker, code, signal) {
                log('e', 'worker ' + i + ' died');
                spawnWorker(i);
            });

            workers[i].on('message', function(data){

                data.options = data.options || {};
                data.options.pid = pid;
                data.options.workers = workers;
                data.options.clusters = clusters;
                data.options.server_id = 'my_server_id';

                if(typeof services_master[data.service] === 'object'){
                    if(typeof services_master[data.service][data.method] === 'function'){
                        services_master[data.service][data.method](data.options, function(res){
                            workers[i].send(res);
                        });
                    } else {
                        log('e', 'method not found - check lib/services-master/' + data.service + ' for available methods');
                    }
                } else {
                    log('e', 'master service not found - check lib/services-master for available services');
                }
            });
        };

        if(config.main.core_limit){
            core_limit = config.main.core_limit;
        } else {
            core_limit = options.num_cpus;
        }

        for(var i = 0; i < core_limit; i++){
            spawnWorker(i);
        }
    };

})();