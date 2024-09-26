# Tenancy Management App

### This application is deployed on Render
### Feel free to explore the app by clicking the link: https://tenancy-management.onrender.com/

***

## Introduction

### Front end - React
- A tenancy management application allows users to read, create, update and delete data stored in back end part.

### Back end - Flask and SQLAlchemy
- A models.py file defines classes that correspond to tables in the database and outlines the relationships between them.
- A seed.py to seed data.
- A app.py for routes and handle requests from front end to send and update data in database.

### Database - PostgreSQL
- A tenancy management database consist of six tables which are users, owners, properties, tenants, rentals and expenses.

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

There are six models in models.py which are User Model, Onwer Model, Property Model, Tenant Model, Rental Model and Expense Model. SQLAlchemy's ORM capabilities allow these classes to map directly to our database tables, simplifying data manipulation through Python objects. Validations and constraints are set up in this file.

#### User Model

User Model is used to create table users and it has one to many relationship to Property and via Property, it has one to many relationship to Owner and Tenant.

#### Owner Model

Owner Model is used to create table owners and it has one to many relationship to Property and via Property, it has many to many relationships to User and Tenant.

#### Property Model

Property Model is used to create table properties and each property belongs to one User and one Owner. It has many to many relationships to Tenant but only have one active tenant at a time. It has one to many relationship to Rental via Tenant and one to many relationship to Expense.

#### Tenant Model

Tenant Model is used to create table tenants and it has one to many relationships to Property (in real life, a tenant might rent several properties, but in this tenancy management system, a new tenant record will be created as the lease term is diffferent). It has one to many relationships to Rental.

#### Rental Model

Rental Model is used to create table rentals and each rental payment belongs to one tenant, thus to one Property and then Owner. 

#### Expense Model

Expense Model is used to create table expenses and each expense belongs to Property and then Onwer.

***

### app.py

There are 16 endpoints (urls) related to Models and database so that front end client can retrive, read, create, update and delete data. 

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

#### Rentals - /rentals
It has two routes, get() and post(). get() returns all rentals. post() creates a new rental.

#### RentalByID - /rentals/<int:id>
It has three routes, get(), patch() and delete(). get() returns the rental. patch() updates the rental based on data from request's JSON. delete() deletes the rental.

#### Expenses - /expenses,
It has two routes, get() and post(). get() returns all expenses. post() creates a new expense.

#### ExpenseByID - /expenses/<int:id>
It has three routes, get(), patch() and delete(). get() returns the expense. patch() updates the expense based on data from request's JSON. delete() deletes the expense.

***

### seed.py

Functions in seed.py is to seed database. 

***

## Tenancy management database

This database is set up when running SQLAlchemy migrations. All files are connected to this database. In this database, there are six tables which are users, owners, properties, tenants, rentals and expenses.

### table users
This table stores id, email, hashed password, name, mobile and authorization (administrator) for users.

### table owners
This table stores id, reference, name, email, mobile, address, note, management start date, management end date and status(active or inactive) for owners.

### table properties
This table stores id, reference, address, commission, letting fee, user id, owner id and status(active or inactive) for properties.

### table tenants
This table stores id, reference, name, email, mobile, note, lease_term, rent, lease start date, lease end date, vacating date, property id and status(active or inactive) for tenants.

### table rentals
This table stores id, amount received, record date, received date, description and tenant id for rentals.

### table expenses
This table stores id, payment amount, record date, payment date, description and property id for expenses payments.

*** 

#### References
1. Academic learning materials
2. Google
3. StackOverflow
4. W3Schools
5. ChatGPT






