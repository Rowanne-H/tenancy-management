#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, jsonify, make_response, session
from flask_migrate import Migrate
from flask_restful import Resource
from datetime import date, datetime
from flask_cors import CORS

# Local imports
from config import app, db, api
from flask_restful import Api, Resource

# Add your model imports
from models import db, User, Owner, Property, Tenant, Transaction

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tenancy_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'my-very-secret-key' 
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)
CORS(app)


# Views go here!
def getDate(value):
    """Convert a date string in 'YYYY-MM-DD' format to a datetime.date object."""
    return datetime.strptime(value, "%Y-%m-%d").date()

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.before_request
def check_if_logged_in():
    if request.endpoint in ['signup', 'login', 'check_session']:
        return
    if 'user_id' not in session:
        return make_response(jsonify({'message': 'Unauthorized'}), 401)

class Signup(Resource):
    def post(self):
        data = request.get_json()
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return make_response(jsonify({'message': 'Email already taken'}), 400)
        user = User(
            email=data['email'],
            name=data['name'],
            mobile=data['mobile'],
            is_accounts=data.get('is_accounts', False)
        )
        user.password_hash = data['password']
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return make_response(user.to_dict(), 201)

class CheckSession(Resource):
    def get(self):
        user = User.query.filter_by(id=session.get('user_id')).first()
        if user: 
            return make_response(jsonify(user.to_dict()))
        else:
            return make_response(jsonify({'message': 'No user is loggoed in'}), 404)  

class Login(Resource):
    def post(self):
        data = request.get_json()
        print(data)
        if not data or 'email' not in data or 'password' not in data:
            return make_response(jsonify({'message': 'Missing email or password'}), 400)
        email = data['email']
        user = User.query.filter_by(email=email).first()  
        if user is None:
            return make_response(jsonify({'message': 'User not found'}), 404)
        password = data['password']
        if user.authenticate(password):
            session['user_id'] = user.id 
            return make_response(jsonify(user.to_dict()), 200) 
        return make_response(jsonify({'message': 'Password is incorrect'}), 400)    

class Logout(Resource):
    def delete(self):
        if 'user_id' not in session or session['user_id'] is None:
            return make_response(jsonify({'message': 'Unauthorized'}), 401)
        session.pop('user_id', None)
        return {}, 204
    
class Users(Resource):
    def get(self): 
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
 
class UserByID(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user is None:
            return make_response(jsonify({'message': 'User not found'}), 404)
        return make_response(jsonify(user.to_dict()), 200) 

    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        print(session.get('user_id'))
        if user is None:
            return make_response(jsonify({'message': 'User not found'}), 404)
        if session.get('user_id') != user.id:
            print(f"Authorization failed: current_user.id  != user.id ({user.id})")
            return make_response(jsonify({'message': 'You do not have permission to edit this record. You can only edit your own records.'}), 403)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'password':
                user.password_hash = data['password']
            else:
                setattr(user, attr, value)
        db.session.add(user)
        db.session.commit()
        return make_response(user.to_dict(), 200)
    
    def delete(self, id):
        current_user = User.query.filter_by(id=session.get('user_id')).first()
        if not current_user.is_accounts:
            return make_response(jsonify({'message': 'Only accounts can delete an user record'}), 403) 
        user = User.query.filter_by(id=id).first()
        if user is None:
            return make_response(jsonify({'message': 'User not found'}), 404) 
        if user.id==current_user.id:
            return make_response(jsonify({'message': 'Accounts can not delete himself/herself'}), 400) 
        property = Property.query.filter_by(user_id=id).first()
        if property:
            return make_response(jsonify({'message': 'User who manage one or more properties cannot be deleted'}), 400)      
        db.session.delete(user)
        db.session.commit()
        return make_response(jsonify({'message': 'User successfully deleted'}), 200)
    
class Owners(Resource):
    def get(self):
        owners = [owner.to_dict() for owner in Owner.query.all()]
        return make_response(jsonify(owners), 200)
    
    def post(self):
        data = request.get_json()
        management_start_date = getDate(data['management_start_date'])
        management_end_date = getDate(data.get('management_end_date')) if data.get('management_end_date') else None
        new_owner = Owner(
            ref=data['ref'],
            name=data['name'],            
            email=data['email'],
            mobile=data['mobile'],
            address=data['address'],
            note=data.get('note', ''),
            management_start_date=management_start_date,
            management_end_date=management_end_date,
            is_active=data.get('is_active', True) 
        )
        db.session.add(new_owner)
        db.session.commit()
        return make_response(new_owner.to_dict(), 201)
    
class OwnerByID(Resource):
    def get(self, id):
        owner = Owner.query.filter_by(id=id).first()
        if owner is None:
            return make_response(jsonify({'message': 'Owner not found'}), 404)
        return make_response(jsonify(owner.to_dict()), 200)
    
    def patch(self, id):
        owner = Owner.query.filter_by(id=id).first()
        if owner is None:
            return make_response(jsonify({'message': 'Owner not found'}), 404)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'management_start_date' or attr == 'management_end_date':
                if value == '':
                    value=None
                else:
                    value=getDate(value)                    
            setattr(owner, attr, value)
        db.session.add(owner)
        db.session.commit()
        return make_response(owner.to_dict(), 200)
    
    def delete(self, id):
        owner = Owner.query.filter_by(id=id).first() 
        if owner is None:
            return make_response(jsonify({'message': 'Owner not found'}), 404)          
        property = Property.query.filter_by(owner_id=id).first()
        if property:
            return make_response(jsonify({'message': 'Owner who hasnot terminated management cannot be deleted'}), 400)      
        db.session.delete(owner)
        db.session.commit()
        return make_response(jsonify({'message': 'Owner successfully deleted'}), 200)
    
class Properties(Resource):
    def get(self):
        properties = [property.to_dict() for property in Property.query.all()]
        return make_response(jsonify(properties), 200)
    
    def post(self):
        data = request.get_json()
        owner = Owner.query.filter_by(id=data['owner_id']).first()
        if owner is None:
            return make_response(jsonify({'message': 'Please input a valid owner id'}), 404)
        user = User.query.filter_by(id=data['user_id']).first()
        if user is None:
            return make_response(jsonify({'message': 'Please input a valid user id'}), 404)
        new_property = Property(
            ref=data['ref'],
            address=data['address'],
            commission=data.get('commission', 0.05),
            letting_fee=data.get('letting_fee', 1),
            is_active=data.get('is_active', True),
            owner_id=data['owner_id'],
            user_id=data['user_id']
        )
        db.session.add(new_property)
        db.session.commit()
        return make_response(new_property.to_dict(), 201)
    
class PropertyByID(Resource):
    def get(self, id):
        property = Property.query.filter_by(id=id).first()
        if property is None:
            return make_response(jsonify({'message': 'Property not found'}), 404)
        return make_response(jsonify(property.to_dict()), 200)
    
    def patch(self, id):
        property = Property.query.filter_by(id=id).first()
        if property is None:
            return make_response(jsonify({'message': 'Property not found'}), 404)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'owner_id':
                owner = Owner.query.filter_by(id=value).first()
                if owner is None:
                    return make_response(jsonify({'message': 'Please input a valid owner id'}), 404)
            if attr == 'user_id':
                user = User.query.filter_by(id=value).first()
                if user is None:
                    return make_response(jsonify({'message': 'Please input a valid user id'}), 404)
            setattr(property, attr, value)
        db.session.add(property)
        db.session.commit()
        return make_response(property.to_dict(), 200)
    
    def delete(self, id):
        tenant = Tenant.query.filter_by(property_id=id).first()
        if tenant:
            return make_response(jsonify({'message': 'Tenanted property cannot be deleted'}), 400) 
        property = Property.query.filter_by(id=id).first()       
        db.session.delete(property)
        db.session.commit()
        return make_response(jsonify({'message': 'Property successfully deleted'}), 200)
    
class Tenants(Resource):
    def get(self):
        tenants = [tenant.to_dict() for tenant in Tenant.query.all()]
        return make_response(jsonify(tenants), 200)
    
    def post(self):
        data = request.get_json()
        property = Property.query.filter_by(id=data['property_id']).first()
        if property is None:
            return make_response(jsonify({'message': 'Please input a valid property id'}), 404)
        lease_start_date = getDate(data['lease_start_date'])
        lease_end_date = getDate(data['lease_end_date'])
        vacating_date = getDate(data.get('vacating_date')) if data.get('vacating_date') else None
        new_tenant = Tenant(
            ref=data['ref'],
            name=data['name'],            
            email=data['email'],
            mobile=data['mobile'],
            note=data.get('note', ''),
            lease_term=data['lease_term'],
            lease_start_date=lease_start_date,
            lease_end_date=lease_end_date,
            vacating_date=vacating_date,
            rent=data['rent'],
            is_active=data.get('is_active', True),
            property_id=data['property_id'] 
        )
        db.session.add(new_tenant)
        db.session.commit()
        return make_response(new_tenant.to_dict(), 201)
    
class TenantByID(Resource):
    def get(self, id):
        tenant = Tenant.query.filter_by(id=id).first()
        if tenant is None:
            return make_response(jsonify({'message': 'Tenant not found'}), 404)
        return make_response(jsonify(tenant.to_dict()), 200)
    
    def patch(self, id):
        tenant = Tenant.query.filter_by(id=id).first()
        if tenant is None:
            return make_response(jsonify({'message': 'Tenant not found'}), 404)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'property_id':
                property = Property.query.filter_by(id=value).first()
                if property is None:
                    return make_response(jsonify({'message': 'Please input a valid owner id'}), 404)
            if attr == 'lease_start_date' or attr == 'lease_end_date' or attr == 'vacating_date':
                if value == '':
                    value=None
                else:
                    value=getDate(value) 
            setattr(tenant, attr, value)
        db.session.add(tenant)
        db.session.commit()
        return make_response(tenant.to_dict(), 200)
    
    def delete(self, id):
        tenant = Tenant.query.filter_by(id=id).first() 
        if tenant is None:
            return make_response(jsonify({'message': 'Tenant not found'}), 404)     
        db.session.delete(tenant)
        db.session.commit()
        return make_response(jsonify({'message': 'Tenant successfully deleted'}), 200)

class Transactions(Resource):
    def get(self):
        transactions = [transaction.to_dict() for transaction in Transaction.query.all()]
        return make_response(jsonify(transactions), 200)
    
    def post(self):
        data = request.get_json()
        property = Property.query.filter_by(id=data['property_id']).first()
        if property is None:
            return make_response(jsonify({'message': 'Please input a valid property id'}), 404)
        created_at = getDate(data.get('created_at')) if data.get('created_at') else datetime.today()
        payment_date = getDate(data['payment_date'])
        new_transaction = Transaction(
            amount=data['amount'],
            category=data['category'],
            created_at=created_at,
            payment_date=payment_date,
            description=data.get('description', 'rent'),
            property_id=data['property_id']
        )
        db.session.add(new_transaction)
        db.session.commit()
        return make_response(new_transaction.to_dict(), 201)
    
class TransactionByID(Resource):
    def get(self, id):
        transaction = Transaction.query.filter_by(id=id).first()
        if transaction is None:
            return make_response(jsonify({'message': 'Transaction not found'}), 404)
        return make_response(jsonify(transaction.to_dict()), 200)
    
    def patch(self, id):
        transaction = Transaction.query.filter_by(id=id).first()
        if transaction is None:
            return make_response(jsonify({'message': 'Transaction not found'}), 404)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'property_id':
                property = Property.query.filter_by(id=value).first()
                if property is None:
                   return make_response(jsonify({'message': 'Please input a valid property id'}), 404)               
            if attr == 'created_at' or attr == 'payment_date':
                value=getDate(value)
            setattr(transaction, attr, value)
        db.session.add(transaction)
        db.session.commit()
        return make_response(transaction.to_dict(), 200)
    
    def delete(self, id):
        transaction = Transaction.query.filter_by(id=id).first()
        if transaction is None:
            return make_response(jsonify({'message': 'Transaction not found'}), 404) 
        db.session.delete(transaction)
        db.session.commit()
        return make_response(jsonify({'message': 'Rental successfully deleted'}), 200)
    


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Users, '/users', endpoint='users')
api.add_resource(UserByID, '/users/<int:id>', endpoint='show_user')
api.add_resource(Owners, '/owners', endpoint='owners')
api.add_resource(OwnerByID, '/owners/<int:id>', endpoint='show_owner')
api.add_resource(Properties, '/properties', endpoint='properties')
api.add_resource(PropertyByID, '/properties/<int:id>', endpoint='show_property')
api.add_resource(Tenants, '/tenants', endpoint='/tenants')
api.add_resource(TenantByID, '/tenants/<int:id>', endpoint='show_tenant')
api.add_resource(Transactions, '/transactions', endpoint='/transactions')
api.add_resource(TransactionByID, '/transactions/<int:id>', endpoint='show_transaction')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

