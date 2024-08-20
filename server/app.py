#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Resource

# Local imports
from config import app, db, api
from flask_restful import Api, Resource

# Add your model imports
from models import db, User, Owner, Property, Tenant, Rental, Expense

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tenancy_managment.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
    
class Owners(Resource):
    def get(self):
        owners = [owner.to_dict() for owner in Owner.query.all()]
        return make_response(jsonify(owners), 200)
    
class Tenants(Resource):
    def get(self):
        tenants = [tenant.to_dict() for tenant in Tenant.query.all()]
        return make_response(jsonify(tenants), 200)
    

    

api.add_resource(Users, '/users')
api.add_resource(Owners, '/owners')
api.add_resource(Tenants, '/tenants')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

