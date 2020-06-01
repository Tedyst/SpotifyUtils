from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from logging import INFO, DEBUG
import SpotifyUtils.config as config
from flask_migrate import Migrate
import ptvsd
import os
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_admin import Admin


APP = Flask(__name__,
            static_folder="../../build/static")
APP.wsgi_app = ProxyFix(APP.wsgi_app)
APP.config['SECRET_KEY'] = config.SECRET_KEY
APP.config['SQLALCHEMY_ECHO'] = False
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

if os.getenv("APP_ENV") == "docker":
    APP.logger.info("Enabled vscode debugger")
    ptvsd.enable_attach()

    APP.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////data/data.db'
else:
    APP.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../data.db'

if APP.debug:
    APP.logger.setLevel(DEBUG)
else:
    APP.logger.setLevel(INFO)

db = SQLAlchemy(APP, session_options={
    'expire_on_commit': False
})

migrate = Migrate(APP, db)
admin = Admin(APP, name='SpotifyUtils', template_mode='bootstrap3')

login_manager = LoginManager(APP)
