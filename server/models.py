import re
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from config import db, bcrypt
from datetime import date, datetime

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    })

db = SQLAlchemy(metadata=metadata)


# Models go here!
def validate_name(value):
    if not value or len(value) < 2:
        raise ValueError(
            "Name must be at least 2 characters long and not empty.")
    return value


def validate_email(value):
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', value):
        raise ValueError("Invalid email format")
    return value


def validate_mobile(value):
    if not value or len(value) != 10:
        raise ValueError("Invalid mobile number format. Must be 10 digits.")
    return value


def validate_address(value):
    if not value or len(value) < 10:
        raise ValueError(
            "Address must be at least 10 characters long and not empty.")
    return value


def validate_date(value):
    if value is None:
        raise ValueError("Date cannot be None")
    return value


def validate_date_format(value):
    if value:
        if not isinstance(value, date):
            raise ValueError("Invalid date format")
    return value


def validate_ref(value):
    if not value or len(value) < 2:
        raise ValueError(
            "ref must be at least 2 characters long and not empty.")
    return value


class BaseModel(db.Model):
    __abstract__ = True

    @validates('name')
    @validates('pay_from')
    @validates('pay_to')
    def validate_name(self, key, value):
        return validate_name(value)

    @validates('email')
    def validate_email(self, key, value):
        return validate_email(value)

    @validates('mobile')
    def validate_mobile(self, key, value):
        return validate_mobile(value)

    @validates('address')
    def validate_address(self, key, value):
        return validate_address(value)

    @validates('management_start_date')
    @validates('lease_start_date')
    @validates('lease_end_date')
    @validates('payment_date')
    @validates('created_at')
    def validate_date(self, key, value):
        return validate_date(value)

    def validate_date_format(self, key, value):
        return validate_date_format(value)

    @validates('ref')
    @validates('description')
    def validate_ref(self, key, value):
        return validate_ref(value)


class User(BaseModel, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    name = db.Column(db.String, unique=True, nullable=False)
    mobile = db.Column(db.String(10), unique=True, nullable=False)
    is_accounts = db.Column(db.Boolean, default=False, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    owners = db.relationship('Owner', backref='user')
    properties = db.relationship('Property', backref='user')
    tenants = db.relationship('Tenant', backref='user')

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash,
                                          password.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'mobile': self.mobile,
            'is_accounts': self.is_accounts,
            "is_active": self.is_active
        }

    def __repr__(self):
        return f'User {self.email}, ID {self.id}'


class Owner(BaseModel, SerializerMixin):
    __tablename__ = 'owners'

    id = db.Column(db.Integer, primary_key=True)
    ref = db.Column(db.String, nullable=False)
    name = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    mobile = db.Column(db.String(10), unique=True, nullable=False)
    address = db.Column(db.String, nullable=False)
    note = db.Column(db.String)
    management_start_date = db.Column(db.Date, nullable=False)
    management_end_date = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    properties = db.relationship('Property', backref='owner')
    tenants = db.relationship('Tenant', backref='owner')
    transactions = db.relationship('Transaction', backref='owner')


    def to_dict(self):
        return {
            'id': self.id,
            'ref': self.ref,
            'name': self.name,
            'email': self.email,
            'mobile': self.mobile,
            'address': self.address,
            'note': self.note,
            'management_start_date': self.management_start_date,
            'management_end_date': self.management_end_date,
            'is_active': self.is_active,
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'Owner(id={self.id})'


class Property(BaseModel, SerializerMixin):
    __tablename__ = 'properties'

    id = db.Column(db.Integer, primary_key=True)
    ref = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    commission = db.Column(db.Float, default=0.05, nullable=False)
    letting_fee = db.Column(db.Float, default=1, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    tenants = db.relationship('Tenant', backref='property')
    transactions = db.relationship('Transaction', backref='property')

    @validates('commission')
    def validate_comission(self, key, value):
        value = float(value)
        if not value or value <= 0 or value >= 0.1:
            raise ValueError("comission must be between 0 and 0.1")
        return value

    @validates('letting_fee')
    def validate_letting_fee(self, key, value):
        value = float(value)
        if not value or value <= 0 or value >= 2:
            raise ValueError("letting fee must be between 0 and 2")
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'ref': self.ref,
            'address': self.address,
            'commission': self.commission,
            'letting_fee': self.letting_fee,
            'owner_id': self.owner_id,
            'user_id': self.user_id,
            'is_active': self.is_active
        }

    def __repr__(self):
        return f'Property(id={self.id})'


class Tenant(BaseModel, SerializerMixin):
    __tablename__ = 'tenants'

    id = db.Column(db.Integer, primary_key=True)
    ref = db.Column(db.String, nullable=False)
    name = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    mobile = db.Column(db.String(), unique=True, nullable=False)
    note = db.Column(db.String)
    lease_term = db.Column(db.Float, nullable=False)
    lease_start_date = db.Column(db.Date, nullable=False)
    lease_end_date = db.Column(db.Date, nullable=False)
    rent = db.Column(db.Float, nullable=False)
    vacating_date = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    transactions = db.relationship('Transaction', backref='tenant')

    @validates('lease_term')
    def validate_lease_term(self, key, value):
        value = float(value)
        if not value or value <= 0:
            raise ValueError("Lease term can not be negative or None")
        return value

    @validates('rent')
    def validate_rent(self, key, value):
        value = float(value)
        if not value or value < 0:
            raise ValueError("Amount must be more than 0")
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'ref': self.ref,
            'name': self.name,
            'email': self.email,
            'mobile': self.mobile,
            'note': self.note,
            'lease_term': self.lease_term,
            'lease_start_date': self.lease_start_date,
            'lease_end_date': self.lease_end_date,
            'rent': self.rent,
            'vacating_date': self.vacating_date,
            'property_id': self.property_id,
            'owner_id': self.property_id,
            'user_id': self.user_id,
            'is_active': self.is_active
        }

    def __repr__(self):
        return f'Tenant(id={self.id})'


class Creditor(BaseModel, SerializerMixin):
    __tablename__ = 'creditors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    def __repr__(self):
        return f'Creditor(id={self.id})'


class Transaction(BaseModel, SerializerMixin):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime,
                           server_default=db.func.now(),
                           nullable=False)
    payment_date = db.Column(db.Date,
                             server_default=db.func.now(),
                             nullable=False)
    category = db.Column(db.String, nullable=False)
    pay_from = db.Column(db.String, nullable=False)
    pay_to = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String, nullable=False)

    tenant_id = db.Column(db.Integer, db.ForeignKey('tenants.id'))
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'))
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'))
    creditor_id = db.Column(db.Integer, db.ForeignKey('creditors.id'))

    @validates('category')
    def validate_category(self, key, value):
        if value != 'Rent' and value != 'Expense' and value != 'Others':
            raise ValueError(
                "The category must be one of the following: Rent, Expense, or Others."
            )
        return value

    @validates('amount')
    def validate_amount(self, key, value):
        value = float(value)
        if not value:
            raise ValueError("Amount cannot be None")
        return value

    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'amount': self.amount,
            'pay_from': self.pay_from,
            'pay_to': self.pay_to,
            'created_at': self.created_at,
            'payment_date': self.payment_date,
            'description': self.description,
            'tenant_id': self.tenant_id,
            'property_id': self.property_id,
            'owner_id': self.owner_id,
            "creditor_id": self.creditor_id
        }

    def __repr__(self):
        return f'Transaction(id={self.id})'
