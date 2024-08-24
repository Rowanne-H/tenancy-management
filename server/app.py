#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, jsonify, make_response
from flask_migrate import Migrate
from flask_restful import Resource
from datetime import date, datetime

# Local imports
from config import app, db, api
from flask_restful import Api, Resource

# Add your model imports
from models import db, User, Owner, Property, Tenant, Rental, Expense

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tenancy_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)


# Views go here!
def getDate(value):
    """Convert a date string in 'YYYY-MM-DD' format to a datetime.date object."""
    return datetime.strptime(value, "%Y-%m-%d").date()

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

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
    
class Owners(Resource):
    def get(self):
        owners = [owner.to_dict() for owner in Owner.query.all()]
        return make_response(jsonify(owners), 200)
    
    def post(self):
        data = request.get_json()
        management_commencement_date = getDate(data['management_commencement_date'])
        management_end_date = getDate(data.get('management_end_date')) if data.get('management_end_date') else None
        new_owner = Owner(
            ref=data['ref'],
            name=data['name'],            
            email=data['email'],
            mobile=data['mobile'],
            address=data['address'],
            note=data.get('note', ''),
            management_commencement_date=management_commencement_date,
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
            if attr == 'management_commencement_date' or attr == 'management_end_date':
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
        vacating_date = getDate(data.get('vacating_date')) if data.get('management_end_date') else None
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

class Rentals(Resource):
    def get(self):
        rentals = [rental.to_dict() for rental in Rental.query.all()]
        return make_response(jsonify(rentals), 200)
    
    def post(self):
        data = request.get_json()
        tenant = Tenant.query.filter_by(id=data['tenant_id']).first()
        if tenant is None:
            return make_response(jsonify({'message': 'Please input a valid tenant id'}), 404)
        created_at = getDate(data.get('created_at')) if data.get('created_at') else datetime.today()
        payment_date = getDate(data['payment_date'])
        new_rental = Rental(
            amount=data['amount'],
            created_at=created_at,
            payment_date=payment_date,
            description=data.get('description', 'rent'),
            tenant_id=data['tenant_id'] 
        )
        db.session.add(new_rental)
        db.session.commit()
        return make_response(new_rental.to_dict(), 201)
    
class RentalByID(Resource):
    def get(self, id):
        rental = Rental.query.filter_by(id=id).first()
        if rental is None:
            return make_response(jsonify({'message': 'Rental not found'}), 404)
        return make_response(jsonify(rental.to_dict()), 200)
    
    def patch(self, id):
        rental = Rental.query.filter_by(id=id).first()
        if rental is None:
            return make_response(jsonify({'message': 'Rental not found'}), 404)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'tenant_id':
               tenant = Tenant.query.filter_by(id=value).first()
               if tenant is None:
                   return make_response(jsonify({'message': 'Please input a valid tenant id'}), 404)
            if attr == 'created_at' or attr == 'payment_date':
                value=getDate(value)
            setattr(rental, attr, value)
        db.session.add(rental)
        db.session.commit()
        return make_response(rental.to_dict(), 200)
    
    def delete(self, id):
        rental = Rental.query.filter_by(id=id).first()
        if rental is None:
            return make_response(jsonify({'message': 'Rental not found'}), 404)   
        db.session.delete(rental)
        db.session.commit()
        return make_response(jsonify({'message': 'Rental successfully deleted'}), 200)
    
class Expenses(Resource):
    def get(self):
        expenses = [expense.to_dict() for expense in Expense.query.all()]
        return make_response(jsonify(expenses), 200)
    
    def post(self):
        data = request.get_json()
        property = Property.query.filter_by(id=data['property_id']).first()
        if property is None:
            return make_response(jsonify({'message': 'Please input a valid property id'}), 404)
        created_at = getDate(data.get('created_at')) if data.get('created_at') else datetime.today()
        payment_date = getDate(data['payment_date'])
        new_expense = Expense(
            amount=data['amount'],
            created_at=created_at,
            payment_date=payment_date,
            description=data.get('description', 'expense'),
            property_id=data['property_id'] 
        )
        db.session.add(new_expense)
        db.session.commit()
        return make_response(new_expense.to_dict(), 201)
    
class ExpenseByID(Resource):
    def get(self, id):
        expense = Expense.query.filter_by(id=id).first()
        if expense is None:
            return make_response(jsonify({'message': 'Expense not found'}), 404)
        return make_response(jsonify(expense.to_dict()), 200)
    
    def patch(self, id):
        expense = Expense.query.filter_by(id=id).first()
        if expense is None:
            return make_response(jsonify({'message': 'Expense not found'}), 404)
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'property_id':
               property = Property.query.filter_by(id=value).first()
               if property is None:
                    return make_response(jsonify({'message': 'Please input a valid property id'}), 404)
            if attr == 'created_at' or attr == 'payment_date':
                value=getDate(value)
            setattr(expense, attr, value)
        db.session.add(expense)
        db.session.commit()
        return make_response(expense.to_dict(), 200)
    

api.add_resource(Users, '/users')
api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(Owners, '/owners')
api.add_resource(OwnerByID, '/owners/<int:id>')
api.add_resource(Properties, '/properties')
api.add_resource(PropertyByID, '/properties/<int:id>')
api.add_resource(Tenants, '/tenants')
api.add_resource(TenantByID, '/tenants/<int:id>')
api.add_resource(Rentals, '/rentals')
api.add_resource(RentalByID, '/rentals/<int:id>')
api.add_resource(Expenses, '/expenses')
api.add_resource(ExpenseByID, '/expenses/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

