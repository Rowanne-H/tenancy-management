# Tenancy Management App

### Feel free to explore the app by clicking the link: [Tenancy Management Software](https://tenancy-management.onrender.com/)

***

## Introduction

### Tenancy Management Software
#### Users
Property Managers from RealEstates or Housing
Companies or owners who have several investing properties in management.
-  

### Front end - React
- A tenancy management application allows users to read, create, update and delete data stored in database.

### Back end - Flask and SQLAlchemy
- A models.py file defines classes (data structure) that correspond to tables in the database and outlines the relationships between them.
- A app.py for routes and handle requests from front end to send, update or delete data in database.
- A seed.py to seed data.

### Database - PostgreSQL
- A tenancy management database consist of six tables which are users, owners, properties, tenants, creditors and transactions.

***

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

## FRONT END

There are six main components which are Users, Owners, Properties, Tenants, Creditors and Transactions. The NavBar component has been added to facilitate easier navigation across different routes in the front end.

### Users 
#### 

### Owners 

###Properties

###Tenants

###Creditors

###Transactions

***

## BACK END 

### models.py and relationships

There are seven models in models.py which are Base Model (mainly for validations on same attributes such as name, email, mobile etc..) User Model, Owner Model, Property Model, Tenant Model, Creditor Model and Transaction Model. Each model generates a table with their name in plural and they are related to each other. Validations and constraints are set up in this file.

#### User Model

User Model is used to create table users and it has one to many relationship to Owner, Property and Tenant.

#### Owner Model

Owner Model is used to create table owners and it has one to many relationship to Property, Tenant and Transaction.

#### Property Model

Property Model is used to create table properties and each property belongs to one User and one Owner. It has one to many relationships to Tenant but only have one active tenant at a time(In this tenancy management software, a new tenant record is created for each unique combination of a tenant and their lease, allowing users to effectively manage multiple properties rented by the same tenant). It has one to many relationship to Transaction.

#### Tenant Model

Tenant Model is used to create table tenants and it has one to many relationships to Transaction.

#### Creditor

Creditor Model is used to create table creditors and it has one to many relationship to Transaction. 

#### Transaction

Transaction Model is used to create table transactions; Each transaction must include both a 'Pay From' and a 'Pay To' field, which can be associated with an owner, a tenant, a property, or a creditor.

***

### app.py

There are 16 endpoints (urls) related to Models and database so that front end client can retrive, read, create, update and delete data. 

#### Authentication-Access Control
Data is accessible only to users who have registered accounts.

### Authorization:
1. Account Authorization (for accounts role)
   - delete any inactive user (excluding the account owner)
   - modify a user's status (is_accounts, is_active, excluding the account owner)
   - update user id for a owner as well as associated properties and tenants
   - create, update or delete a creditor records
   - create, update and delete a transaction records
2. User Authorization
   - sign up and modify their profile information and change the password
   - create and udpate managing properties as well as associated tenants and owners (excluding change of user id).
   - archive inactive owners, properties and tenants
   - delete owners who do not have any associated properties, tenants, or transactions.
   - delete delete properties that do not have any associated tenants or transactions.
   - delete tenants who do not have any associated transactions.

#### Sign up - /signup
It has one method, post(). post() creates a new user in database and log in the user authomatically to access the database.

#### CheckSession - /check_session
It has one method, get(). get() retrieves the user_id value from the session. If the session has a user_id, database is available for the user. If the session does not have a user_id, user is required to log in or sign up.

#### Login - /login
It has one method, post(). It gets an email and a password from request's JSON. If email and password are correct, it retrieves the user and sets the session's user_id so the user can access the dababase. 

#### Logout - /logout
It has one method, delete(). it removes the user_id value from the session.

#### Users - /users
It has one method, get(). get() returns all users.

#### UserById - /users/<int:id>
It has three methods, get(), patch() and delete(). get() returns the user. patch() updates the user based on data from request's JSON. delete() deletes the user.

#### Onwers - /owners
It has two methods, get() and post(). get() returns all owners. post() creates a new owner.

#### OwnerById - /owners/<int:id>
It has three methods, get(), patch() and delete(). get() returns the owner. patch() updates the owner based on data from request's JSON. delete() deletes the owner.

#### Properties - /properties
It has two methods, get() and post(). get() returns all owners. post() creates a new owner.

#### PropertyById - /properties/<int:id>
It has three methods, get(), patch() and delete(). get() returns the property. patch() updates the property based on data from request's JSON. delete() deletes the property.

#### Tenants - /tenants
It has two methods, get() and post(). get() returns all tenants. post() creates a new tenant.

#### TenantByID - /tenants/<int:id>
It has three methods, get(), patch() and delete(). get() returns the owner. patch() updates the tenant based on data from request's JSON. delete() deletes the tenant.

#### Creditors - /creditors
It has two methods, get() and post(). get() returns all creditors. post() creates a new creditor.

#### CreditorlByID - /creditors/<int:id>
It has three methods, get(), patch() and delete(). get() returns the creditor. patch() updates the creditor based on data from request's JSON. delete() deletes the creditor.

#### Transactions - /transactions
It has two methods, get() and post(). get() returns all transactions. post() creates a new transaction.

#### TransactionID - /transactions/<int:id>
It has three methods, get(), patch() and delete(). get() returns the transaction. patch() updates the transaction based on data from request's JSON. delete() deletes the transaction.

***

### seed.py

Functions in seed.py is to seed database. 

***

## Tenancy management database

This database is set up when running SQLAlchemy migrations. All files are connected to this database. In this database, there are six tables which are users, owners, properties, tenants, creditors and transactions.

### table users
This table stores id, email, hashed password, name, mobile and authorization (administrator) for users.

### table owners
This table stores id, reference, name, email, mobile, address, note, management start date, management end date and status(active or inactive), user_id for owners.

### table properties
This table stores id, reference, address, commission, letting fee, user id, owner id and status(active or inactive) for properties.

### table tenants
This table stores id, reference, name, email, mobile, note, lease_term, rent, lease start date, lease end date, vacating date, property id, owner id, user id and status(active or inactive) for tenants.

### creditors
This table stores id and name for creditors.

### table transactions
This table stores id, record date, payment date, payment amount, payer, payee, description, property id, tenant id, owner id, user id for transactions.

*** 

#### References
1. Academic learning materials - Acadmey Xi
2. Google
3. StackOverflow
4. W3Schools
5. ChatGPT






