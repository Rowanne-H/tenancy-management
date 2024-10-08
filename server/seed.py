#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from datetime import datetime, timedelta, date

# Local imports
from app import app
from models import db, User, Owner, Property, Tenant, Transaction, Creditor

fake = Faker()


def delete_records():
    User.query.delete()
    Owner.query.delete()
    Property.query.delete()
    Tenant.query.delete()
    Transaction.query.delete()
    Creditor.query.delete()
    db.session.commit()


def generate_mobile_number():
    return f"04{randint(10000000, 99999999):08d}"


def create_users():
    users = []
    # create an accounts to manage users
    accounts = User(email='admin@gmail.com',
                    name=fake.unique.name(),
                    mobile=generate_mobile_number(),
                    is_accounts=True)
    accounts.password_hash = '1'
    users.append(accounts)
    test = User(email='test@gmail.com',
                name=fake.unique.name(),
                mobile=generate_mobile_number())
    test.password_hash = '1'
    users.append(test)
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
    return fake.date_between(start_date=first_day_of_month -
                             timedelta(days=15),
                             end_date=last_day_of_month)


def create_owners():
    owners = []
    property_managers = [user for user in users if user.is_accounts == False]
    #management has been terminated
    name = fake.unique.name()
    inactive_owner = Owner(
        ref=name[:5],
        name=name,
        email=fake.unique.email(),
        mobile=generate_mobile_number(),
        address=fake.unique.address(),
        management_start_date=generate_a_date() - timedelta(days=30),
        management_end_date=datetime.today() - timedelta(days=7),
        is_active=False,
        user=rc(property_managers))
    owners.append(inactive_owner)
    for i in range(6):
        name = fake.unique.name()
        owner = Owner(ref=name[:5],
                      name=name,
                      email=fake.unique.email(),
                      mobile=generate_mobile_number(),
                      address=fake.unique.address(),
                      management_start_date=generate_a_date() -
                      timedelta(days=60),
                      user=rc(property_managers))
        owners.append(owner)
    db.session.add_all(owners)
    db.session.commit()
    return owners


def create_properties(owners):
    properties = []
    active_owners = [owner for owner in owners if owner.is_active == True]
    inactive_owner = owners[0]
    address = fake.unique.address()
    inactive_property = Property(ref=address[:5],
                                 address=address,
                                 commission=0.05,
                                 letting_fee=1,
                                 owner=inactive_owner,
                                 user_id=inactive_owner.user_id,
                                 is_active=False)
    properties.append(inactive_property)
    for owner in active_owners:
        address = fake.unique.address()
        property = Property(
            ref=address[:5],
            address=address,
            commission=0.05,
            letting_fee=1,
            owner=owner,
            user_id=owner.user_id,
        )
        properties.append(property)
    db.session.add_all(properties)
    db.session.commit()
    return properties


def create_tenants(properties):
    tenants = []
    active_properties = [
        property for property in properties if property.is_active == True
    ]
    inactive_property = properties[0]
    name = fake.unique.name()
    inactive_tenant = Tenant(
        ref=name[:5],
        name=name,
        email=fake.unique.email(),
        mobile=generate_mobile_number(),
        rent=500,
        lease_term=12,
        lease_start_date=datetime.today() + timedelta(days=10),
        lease_end_date=datetime.today() + timedelta(days=375),
        property=inactive_property,
        owner_id=inactive_property.owner_id,
        user_id=inactive_property.user_id,
        is_active=False)
    tenants.append(inactive_tenant)
    for property in active_properties:
        date = generate_a_date()
        name = fake.unique.name()
        tenant = Tenant(ref=name[:5],
                        name=name,
                        email=fake.unique.email(),
                        mobile=generate_mobile_number(),
                        rent=randint(3, 10) * 100,
                        lease_term=12,
                        lease_start_date=date,
                        lease_end_date=date + timedelta(days=365),
                        property=property,
                        owner_id=property.owner_id,
                        user_id=property.user_id)
        tenants.append(tenant)
    db.session.add_all(tenants)
    db.session.commit()
    return tenants


def create_creditors():
    creditors = []
    agent = Creditor(name='Real Estate Agent', )
    creditors.append(agent)
    others = Creditor(name='Others', )
    creditors.append(others)
    for i in range(2):
        tradesman = Creditor(name=fake.unique.name(), )
        creditors.append(tradesman)
    db.session.add_all(creditors)
    db.session.commit()
    return creditors


def create_transactions(tenants, properties, owners):
    transactions = []
    now = date.today()
    active_tenants = [tenant for tenant in tenants if tenant.is_active == True]
    for tenant in active_tenants:
        payment_date = tenant.lease_start_date
        property = [
            property for property in properties
            if property.id == tenant.property_id
        ][0]
        owner = [owner for owner in owners if owner.id == property.owner_id][0]
        if payment_date < now:
            letting_fee = Transaction(
                category='Expense',
                amount=-tenant.rent,
                pay_from=owner.name,
                pay_to='Real Estate Agent',
                created_at=payment_date + timedelta(days=1),
                payment_date=payment_date + timedelta(days=1),
                description='Letting fee',
                property_id=property.id,
                owner_id=owner.id)
            transactions.append(letting_fee)
            db.session.add(letting_fee)
        while payment_date < now:
            rental = Transaction(category='Rent',
                                 amount=tenant.rent,
                                 created_at=payment_date,
                                 payment_date=payment_date,
                                 pay_from=tenant.name,
                                 pay_to=owner.name,
                                 description='Rent',
                                 tenant_id=tenant.id,
                                 property_id=property.id,
                                 owner_id=owner.id)
            transactions.append(rental)
            db.session.add(rental)
            commission = Transaction(category='Expense',
                                     amount=-tenant.rent * 0.05,
                                     created_at=payment_date,
                                     payment_date=payment_date,
                                     pay_from=owner.name,
                                     pay_to='Real Estate Agent',
                                     description='Commission',
                                     property_id=property.id,
                                     owner_id=owner.id)
            transactions.append(commission)
            db.session.add(commission)
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
        properties = create_properties(owners)
        tenants = create_tenants(properties)
        creditors = create_creditors()
        transactions = create_transactions(tenants, properties, owners)
