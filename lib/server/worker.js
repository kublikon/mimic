(function(){

    var log = require('../console'),
        config = require('../config'),
        compress = require('../compress'),
        path = require('path');

    module.exports = function(options){

        var cors = require('cors'),
            express = require('express'),
            app = express(),
            server = require('http').createServer(app),

            WebSocketServer = require('ws').Server,
            wss = new WebSocketServer({ server: server }),

            lessMiddleware = require('less-middleware'),
            body_parser = require('body-parser'),
            pid = options.cluster.worker.process.pid;

        server.listen(config.main.port_worker);

        log('i', config.main.title + ' worker started on port ' + config.main.port_worker);

        // less paths
        if(config.main.compression){
            global.cache_path = '/cache';
        }

        // setup app
        app.use(body_parser.json({ limit: '5mb' }));
        app.set('views', options.dirname + '/views');
        app.set('view engine', 'ejs');
        app.use(lessMiddleware(options.dirname + '/public/less', {
            dest: options.dirname + '/public',
            preprocess: {
                path: function(pathname, req) {
                    return pathname.replace(path.sep + 'css' + path.sep, path.sep);
                }
            }
        }));
        app.use(cors());
        app.use(express.static(options.dirname + '/public'));
        app.pid = pid;
        app.options = options;
        app.wss = wss;

        // server stats
        // services_socket.server_stats.setWorkerStats(pid, options.os, config.main.port_worker);

        var static = require('../services/static')(app),
            settings = require('../services/settings')(app),
            endpoints = require('../services/endpoints')(app, express),
            static_views = require('../services/static-views')(app);
    };

})();