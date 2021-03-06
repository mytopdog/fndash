import datetime, os

from flask import Flask, send_from_directory
from flask_cors import CORS
from celery import Celery
from app.api import api, v2_api
from app.database import db
from app.config import DevConfig, ProdConfig
from app.celery import CeleryConfig

app = Flask(__name__, static_folder='web/build')
if os.environ.get('FLASK_ENV') == 'production' or os.environ.get(
        'FLASK_ENV') == 'test' or os.environ.get('CI'):
    app.config.from_object(ProdConfig)
else:
    CORS(app)
    app.config.from_object(DevConfig)

db.init_app(app)
app.register_blueprint(api)
app.register_blueprint(v2_api)

celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)
celery.config_from_object(CeleryConfig)
TaskBase = celery.Task


class ContextTask(TaskBase):
    abstract = True

    def __call__(self, *args, **kwargs):
        with app.app_context():
            return TaskBase.__call__(self, *args, **kwargs)


celery.Task = ContextTask


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists('app/web/build/' + path):
        return send_from_directory('web/build', path)
    else:
        return send_from_directory('web/build', 'index.html')
