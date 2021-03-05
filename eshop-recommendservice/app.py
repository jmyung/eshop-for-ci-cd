from flask import Flask
import requests, random, os
from opentelemetry import trace
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleExportSpanProcessor
from opentelemetry import propagators
from opentelemetry.propagators.b3 import B3Format
from opentelemetry.exporter import jaeger

_service_name = os.environ.get("SERVICE_NAME", default='eshop-recommendservice')
_url_productservice = os.environ.get("URL_PRODUCTSERVICE", default='http://localhost:8080/')


# create a jaeger exporter
jaeger_exporter = jaeger.JaegerSpanExporter(
    service_name=_service_name,
)

# b3 format 
propagators.set_global_textmap(B3Format())

# tracer
trace.set_tracer_provider(TracerProvider())
trace.get_tracer_provider().add_span_processor(SimpleExportSpanProcessor(jaeger_exporter))
tracer = trace.get_tracer(__name__)

# define flask app
app = Flask(__name__)

# instrument flask app
FlaskInstrumentor().instrument_app(app)
RequestsInstrumentor().instrument()

@app.route("/api/recommends", methods=['GET'])
def recommend():
  # 상품 목록을 조회한다.
  with tracer.start_as_current_span('get product list'):
      response = requests.get(_url_productservice + "/api/products")
  products = response.json()
  # 랜덤한 4개의 상품을 추천한다.
  recommendations = { 'recommendations': random.sample(products['products'], 4)}
  print("recommendations : {}".format(recommendations))
  return recommendations
