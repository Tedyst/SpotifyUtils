from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from logging import INFO
import SpotifyUtils.config as config

APP = Flask(__name__,
            template_folder='../templates',
            static_folder="../static")
APP.config['SECRET_KEY'] = config.SECRET_KEY
APP.config['SQLALCHEMY_ECHO'] = False
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
APP.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../data.db'
APP.logger.setLevel(INFO)

db = SQLAlchemy(APP, session_options={
    'expire_on_commit': False
})

login_manager = LoginManager(APP)
