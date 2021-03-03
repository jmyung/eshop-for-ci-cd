'use strict';
 
const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { B3Propagator } = require('@opentelemetry/core');
 
module.exports = (serviceName) => {
    const provider = new NodeTracerProvider();
    const exporter = new JaegerExporter({ serviceName: serviceName });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register({ propagator: new B3Propagator() })
    return opentelemetry.trace.getTracer(serviceName);
};