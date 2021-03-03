'use strict';

const initTracer = require('jaeger-client').initTracer;

modules.exports = (serviceName) => {
    var config = {
        serviceName: serviceName,
        sampler: {
            type: 'const',
            param: 1
        }
    };
    var options = {
        logger: console,
    };
    return initTracer(config, options);
};