#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from datetime import datetime, timedelta, date


# Local imports
from app import app
from models import db, User, Owner, Property, Tenant, Transaction

fake = Faker()

def delete_records():
    User.query.delete()
    Owner.query.delete()
    Property.query.delete()
    Tenant.query.delete()
    Transaction.query.delete()
    db.session.commit()

def generate_mobile_number():
    return f"04{randint(10000000, 99999999):08d}"

def create_users():
    users = []
    accounts = User(
       email='admin@gmail.com',
       name=fake.unique.name(),
       mobile=generate_mobile_number(),
       is_accounts=True
    )
    accounts.password_hash = '123456'
    users.append(accounts)
    for i in range(2):
        user = User(
            email=fake.unique.email(),
            name=fake.unique.name(),
            mobile=generate_mobile_number(),
        )
        user.password_hash = fake.password()
        users.append(user)
    db.session.add_all(users)
    db.session.commit()
    return users

def generate_a_date():
    #generate a random day within the current month
    today = datetime.today()
    first_day_of_month = today.replace(day=1)
    next_month = first_day_of_month.replace(day=28) + timedelta(days=4)
    first_day_of_next_month = next_month.replace(day=1)
    last_day_of_month = first_day_of_next_month - timedelta(days=1)
    return fake.date_between(start_date=first_day_of_month - timedelta(days=15), end_date=last_day_of_month)

def create_owners():
    owners = []
    #management has been terminated
    inactive_owner = Owner(
        ref=fake.word(),
        name=fake.unique.name(),        
        email=fake.unique.email(),
        mobile=generate_mobile_number(),
        address=fake.unique.address(),
        management_start_date=generate_a_date()-timedelta(days=30),
        management_end_date=datetime.today() - timedelta(days=7),
        is_active=False
    )
    owners.append(inactive_owner)
    for i in range(10):
        owner = Owner(
            name=fake.unique.name(),
            ref=fake.word(),
            email=fake.unique.email(),
            mobile=generate_mobile_number(),
            address=fake.unique.address(),
            management_start_date=generate_a_date()-timedelta(days=60)
        )
        owners.append(owner)
    db.session.add_all(owners)
    db.session.commit()
    return owners

def create_properties(users, owners):
    properties = []
    property_managers = [user for user in users if user.is_accounts==False]
    active_owners = [owner for owner in owners if owner.is_active==True]
    inactive_owner = owners[0]
    inactive_property = Property(
        ref=fake.word(),
        address=fake.unique.address(),
        commission=0.05,
        letting_fee=1,
        user=rc(property_managers),
        owner=inactive_owner,
        is_active=False
    )
    properties.append(inactive_property)
    for owner in active_owners:
        property = Property(
            ref=fake.word(),
            address=fake.unique.address(),
            commission=0.05,
            letting_fee=1,
            user=rc(property_managers),
            owner=owner
        )
        properties.append(property)
    db.session.add_all(properties)
    db.session.commit()
    return properties

def create_tenants(properties):
    tenants = []
    active_properties = [property for property in properties if property.is_active==True]
    inactive_property = properties[0]
    inactive_tenant = Tenant(
        name=fake.unique.name(),
        ref=fake.word(),
        email=fake.unique.email(),
        mobile=generate_mobile_number(),
        rent=500,
        lease_term=12,        
        lease_start_date=datetime.today()+timedelta(days=10),
        lease_end_date=datetime.today()+timedelta(days=375),
        property=inactive_property,
        is_active=False
    )
    tenants.append(inactive_tenant)
    for property in active_properties:
        date = generate_a_date()
        tenant = Tenant(
            name=fake.unique.name(),
            ref=fake.word(),
            email=fake.unique.email(),
            mobile=generate_mobile_number(),
            rent=randint(3, 10)*100,
            lease_term=12,
            lease_start_date=date,
            lease_end_date=date+timedelta(days=365),
            property=property
        )
        tenants.append(tenant)
    db.session.add_all(tenants)
    db.session.commit()
    return tenants

def create_transactions(tenants, properties, owners):
    transactions = []
    now = date.today()
    active_tenants = [tenant for tenant in tenants if tenant.is_active==True]
    for tenant in active_tenants:  
        payment_date = tenant.lease_start_date
        property = [property for property in properties if property.id==tenant.property_id][0]
        owner = [owner for owner in owners if owner.id==property.owner_id][0]
        if payment_date < now:
            letting_fee = Transaction(
                category='Expense',
                amount=-tenant.rent,
                created_at=payment_date+timedelta(days=1),
                payment_date=payment_date+timedelta(days=1),
                description='Letting fee',
                tenant_id=tenant.id,
                property_id=property.id,
                owner_id=owner.id

            )
            transactions.append(letting_fee)
            db.session.add(letting_fee)
        while payment_date < now:
            rental = Transaction(
                category='Rent',
                amount=tenant.rent,
                created_at=payment_date,
                payment_date=payment_date,
                description='Rent',
                tenant_id=tenant.id,
                property_id=property.id,
                owner_id=owner.id
            )
            transactions.append(rental)
            db.session.add(rental)
            commission = Transaction(
                category='Expense',
                amount=-tenant.rent*0.05,
                created_at=payment_date,
                payment_date=payment_date,
                description='Commission',
                tenant_id=tenant.id,
                property_id=property.id,
                owner_id=owner.id
            )
            transactions.append(commission )
            db.session.add(commission )
            payment_date += timedelta(days=7)
    db.session.commit()  
    return transactions

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        delete_records()
        users = create_users()
        owners = create_owners()
        properties = create_properties(users, owners)
        tenants = create_tenants(properties)
        transactions = create_transactions(tenants, properties, owners)

