from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from logging import INFO, DEBUG
import SpotifyUtils.config as config
from flask_migrate import Migrate

APP = Flask(__name__,
            static_folder="../../build/static")
APP.config['SECRET_KEY'] = config.SECRET_KEY
APP.config['SQLALCHEMY_ECHO'] = False
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
APP.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../data.db'
if APP.debug:
    APP.logger.setLevel(DEBUG)
else:
    APP.logger.setLevel(INFO)

db = SQLAlchemy(APP, session_options={
    'expire_on_commit': False
})

migrate = Migrate(APP, db)

login_manager = LoginManager(APP)
