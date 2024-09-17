# Tenancy Management App

## Introduction

### Front end


### Back end

- A tenancy management database with six tables which are users, owners, properties, tenants, creditors and transactions.
- A seed.py to seed data.
- A app.py for routes and handle requests from front end to send or update data in database.

## Directory structure

```console
.
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── README.md
├── client
│   ├── public
|   ├── src
│   ├── .gitignore
│   └── package.json
└── server
    ├── migrations
    ├── app.py
    ├── config.py
    ├── models.py
    └── seed.py
```

***

## BACK END 

***

### tenancy management database

This database is set up when running SQLAlchemy migrations. All files are connected to this database. In this database, there are six tables which are users, owners, properties, tenants, creditors and transactions.

#### table users
This table stores id, email, hashed password, name, mobile, authorization (administrator) and status for users.

#### table owners
This table stores id, reference, name, email, mobile, address, note, management start date, management end date and status(active or inactive), user id for owners.

#### table properties
This table stores id, reference, address, commission, letting fee, user id, owner id and status(active or inactive) for properties.

#### table tenants
This table stores id, reference, name, email, mobile, note, lease_term, rent, lease start date, lease end date, vacating date, property id, owner id, user idand status(active or inactive) for tenants.

#### table creditors
This table stores id, name, and status for users.

#### table transactions
This table stores id, payment amount, record date, payment date, category, payer, payee, description as well as relevant tenant id, property id, owner id and creditor id for expenses payments.

*** 

### models.py and relationships

There are seven models in models.py which are Base Model (mainly for validations on same attributes such as name, email, mobile etc..) User Model, Onwer Model, Property Model, Tenant Model, Creditor Model and Transaction Model. Each model generates a table with their name in plural and they are related to each other. Validations and constraints are set up in this file.

#### User Model

User Model is used to create table users and it has one to many relationships to Owner, and its related Property and Tenant.

#### Owner Model

Owner Model is used to create table owners and one Onwer has only one User.

#### Property Model

Property Model is used to create table properties and each property belongs to one Owner and then related User. It has many to many relationships to Tenant but only have one active tenant at a time. It has one to many relationship to Transaction.

#### Tenant Model

Tenant Model is used to create table tenants and it has one to many relationships to Property (in real life, a tenant might rent several properties, but in this tenancy management system, a new tenant record will be created as the lease term is diffferent) and then related Onwer and User. It has one to many relationships to Transaction.

#### Creditor Model

Creditor Model is used to create table creditors and it has one to many relationships to Transaction.

#### Transaction Model

Transaction Model is used to create table transactions and it has one to  to many relationships to Tenant, Owner, Property and Creditor.

***

### app.py

There are 16 endpoints (urls) related to Models and database so that front end client can retrive, read, create, update and delete data. Authentication and authorization are implemented as follows:
1. Access Control:
   Data is available for registered user only
2. Account Authorization (for accounts role)
   - delete any inactive user (excluding the account owner)
   - modify a user's status (is_accounts, is_active)
   - change user id for a owner as well as related properties and tenants
   - create, update or delete a creditor
   - create, update and delete a transaction
3. User Authorization
   - sign up and modify their profile information and change the password
   - create and udpate managing properties as well as associated owners and tenants. (except change of user id)
   - archive or delete any inactive owners, properties and tenants

#### Sign up - /signup
It has one route, post(). post() creates a new user in database and log in the user authomatically to access the database.

#### CheckSession - /check_session
It has one route, get(). get() retrieves the user_id value from the session. If the session has a user_id, database is available for the user. If the session does not have a user_id, user is required to log in or sign up.

#### Login - /login
It has one route, post(). It gets an email and a password from request's JSON. If email and password are correct, it retrieves the user and sets the session's user_id so the user can access the dababase. 

#### Logout - /logout
It has one route, delete(). it removes the user_id value from the session.

#### Users - /users
It has one routes, get(). get() returns all users.

#### UserById - /users/<int:id>
It has three routes, get(), patch() and delete(). get() returns the user. patch() updates the user based on data from request's JSON. delete() deletes the user.

#### Onwers - /owners
It has two routes, get() and post(). get() returns all owners. post() creates a new owner.

#### OwnerById - /owners/<int:id>
It has three routes, get(), patch() and delete(). get() returns the owner. patch() updates the owner based on data from request's JSON. delete() deletes the owner.

#### Properties - /properties
It has two routes, get() and post(). get() returns all owners. post() creates a new owner.

#### PropertyById - /properties/<int:id>
It has three routes, get(), patch() and delete(). get() returns the property. patch() updates the property based on data from request's JSON. delete() deletes the property.

#### Tenants - /tenants
It has two routes, get() and post(). get() returns all tenants. post() creates a new tenant.

#### TenantByID - /tenants/<int:id>
It has three routes, get(), patch() and delete(). get() returns the owner. patch() updates the tenant based on data from request's JSON. delete() deletes the tenant.

#### Creditors - /creditors
It has two routes, get() and post(). get() returns all creditors. post() creates a new creditor.

#### CreditorByID - /creditors/<int:id>
It has three routes, get(), patch() and delete(). get() returns the creditor. patch() updates the creditor based on data from request's JSON. delete() deletes the creditor.

#### Transactions - /transactions
It has two routes, get() and post(). get() returns all transactions. post() creates a new transaction.

#### TransactionByID - /transactionss/<int:id>
It has three routes, get(), patch() and delete(). get() returns the transaction. patch() updates the transaction based on data from request's JSON. delete() deletes the transaction.

***

### seed.py

Functions in seed.py is to seed database. 

***

#### References
1. Academic learning materials
2. Google
3. StackOverflow
4. W3Schools
5. ChatGPT






