'use strict';

module.exports = (serviceName) => {
    var { initTracerFromEnv, ZipkinB3TextMapCodec } = require('jaeger-client');
    const opentracing = require('opentracing');

    var config = {
        serviceName: serviceName,
        sampler: {
            type: 'const',
            param: 1,
        },
        reporter: {
            logSpans: true,
        },
    };

    var options = {
        logger: {
            info: function logInfo(msg) {
                console.log('INFO  ', msg);
            },
            error: function logError(msg) {
                console.log('ERROR ', msg);
            },
        },
    };
    var tracer = initTracerFromEnv(config, options);

    var codec = new ZipkinB3TextMapCodec({ urlEncoding: true });
    tracer.registerInjector(opentracing.FORMAT_HTTP_HEADERS, codec);
    tracer.registerExtractor(opentracing.FORMAT_HTTP_HEADERS, codec);
    return tracer;
};