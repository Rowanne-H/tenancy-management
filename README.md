# Tenancy Management App

### Feel free to explore the app by clicking the link: [Tenancy Management Software](https://tenancy-management.onrender.com/)

### Manual 

#### Users
  - Staff (Property Managers, Adminstrators, Accountants etc..) from investment companies, RealEstates or Housing
  - Owners who have several investing properties in management.

#### Roles
1. Accounts Management Users - Users with the "is_accounts" option checked
   - Users with the "is_accounts" option checked can manage users (delete or update user status), transfer ownership (change user for owners), and oversee financial accounts (creditors and transaction records).
2. Standard Users
   - Users without the "is_accounts" option are primarily using the app to access data as well as manage owners, properties, and tenants under their management.
  
#### Sign in 
1. Navigate to [Sign in](https://tenancy-management.onrender.com/)
2. Enter your email address and password
3. click "Submit" button, you will be then directed to the home page
  
#### Sign up
1. Navigate to [Sign up](https://tenancy-management.onrender.com/)
   - Click "Sign up" button to be directed to sign up page
3. Fill out the Sign Up form
   - Enter your email address, password, name and mobile
3. click "Submit" button, you will then be directed to the home page

#### View current user profile 
1. Navigate to User Details Page 
   - Click on the User Icon in the top right cornor of the screen.
   - In the dropdown menu, select "View my profile" to go to User Details page

#### Navigate to Edit User page
1. Navigate to Edit User page
   - Click on the User Icon in the top right cornor of the screen.
   - In the dropdown menu, select "Edit my profile" to go to Edit User Form page
     
#### Update current user profile 
1. Navigate to Edit User page   
2. Fill out Edit User Form with updated information
3. Save changes
   - Click "submit" button to save changes
   - You will then be directly to User Details page

#### Change current user password
1. Navigate to Edit User page
2. In the Edit User Form page, click "Change Password" button
3. Enter new password
4. Save changes
   - Click "submit" button to save changes
   - You will then be directly to User Details page

#### Navigate to Users (Owners, Properties, Tenants, Creditors or Transactions) page
1. Navigate to Users page
   - Click on "People" at the top of the screen
   - In the dropdown menu, select "Users" to go to Users page
2. Filter users
   - Use the search fields to find users by name, email, or mobile etc..
   - Check the box for "Show Inactive Users" to include inactive users in the page

#### Navigate to User (Owner, Property, Tenant, Creditor or Transaction) Details page
1. Navigate to Users page
2. Select the user you want to view to access User Details page
3. Click lick "View Owners of Managed Properties" will be directed to Properties page with selected properties that is under management of selected user.
   
#### Change user status 
Only Accounts Management Users can perform this action
1. Navigate to Change Status page
   - Navigate to User Details page
   - In the User Details page, click "Change Status" button
2. Check or uncheck the boxes for "Is Accounts?" or "Is Active?" as needed
3. Save changes
   - Click "submit" button to save changes
   - You will then be directly to User Details page
4. Note: Current user can not change his record

#### Delete user (creditor or transaction)
Only Accounts Management Users can perform this action
1. Navigate to User Details page
2. In the User Details page, click "Delete" button
3. You will then be directly to Users page
4. Note: Current user can not delete his record

#### Update creditor (transaction) record
Only Accounts Management Users can perform this action
1. Navigate to Edit Creditor Form page
   - Navigate to Creditor Details page
   - In the Creditor Details page, click "Edit" button
2. Fill out Edit Creditor Form with updated information
3. Save changes
   - Click "submit" button to save changes
   - You will then be directly to Creditor Details page
     
#### Delete creditor (transaction) record
Only Accounts Management Users can perform this action
1. Navigate to Creditor Details page
2. In the Creditor Details page, click "Delete" button
3. You will then be directly to Creditors page

#### Change owner's Property Manager
Only Accounts Management Users can perform this action
1. Navigate to Change Property Manager Form page
   - Navigate to Owner Details page
   - In the Owner Details page, click "Change Property Manager" button
2. Select the Property Manager
3. Save changes
   - Click "submit" button to save changes
   - You will then be directly to Owner Details page

#### Update owner (property and tenant) record
Current user can only update owner record that is under his management
1. Navigate to Edit Owner Form page
   - Navigate to Owner Details page
   - In the Owner Details page, click "Edit" button
2. Fill out with updated information
3. Save changes
   - Click "submit" button to save changes
   - You will then be directly to Owner Details page
     
#### Delete owner (property and tenant) record
Current user can only delete owner record that is under his management and does not have any associated record
1. Navigate to Owner Details page
2. In the Owner Details page, click "Delete" button
3. You will then be directly to Creditors page

***

## Introduction 

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

There are six main parts which are Users, Owners, Properties, Tenants, Creditors and Transactions. The NavBar component has been added to facilitate easier navigation across different routes in the front end.

### URL
https://tenancy-management.onrender.com/

#### App.js
Main component that includes the Login page or the main page (with a Navbar and different views) based on the user's login status.

#### Login.js 
Show Login component or Signup component based on state "showLogin".

#### LoginForm.js 
This component provides a login form for user to login and link for user to switch to SignupForm component

#### SignupForm.js
This component provides a signup form for user to sign up and link for user to switch to Login component.

#### NavBar.js
This component, displayed at the top of the screen for logged-in users, features a user icon with a dropdown menu on the right, a search bar in the middle, and links to Home, Users, Owners, Properties, Tenants, Creditors, and Transactions on the left.

#### Home.js
Homepage of this application.

### URL
https://tenancy-management.onrender.com/users
https://tenancy-management.onrender.com/users/id/owners
https://tenancy-management.onrender.com/owners
https://tenancy-management.onrender.com/owners/id/transactions
https://tenancy-management.onrender.com/properties
https://tenancy-management.onrender.com/tenants
https://tenancy-management.onrender.com/tenants/id/transactions
https://tenancy-management.onrender.com/creditors
https://tenancy-management.onrender.com/transactions

#### Users.js (Owners.js, Properties.js, Tenants.js, Creditors.js and Transactions.js) 
This component receives user data as props and set up mapping fields, type and sort order, and passes them down to DisplayTable.

#### DisplayTable.js
This component sets up the description text, search fields and table titles based on the props received and passes them to DisplayTableRow.

#### DisplayTableRow.js
This component displays information based on props and provides links to navigate to other routes. 

### URL
- https://tenancy-management.onrender.com/owners/new
- https://tenancy-management.onrender.com/properties/new
- https://tenancy-management.onrender.com/tenants/new
- https://tenancy-management.onrender.com/creditors/new
- https://tenancy-management.onrender.com/transactions/new

#### FormNewData.js
This component provides a form for user to create a new owner, property, tenant, creditor and transaction.

### URL
- https://tenancy-management.onrender.com/owners/id/edit
- https://tenancy-management.onrender.com/properties/id/edit
- https://tenancy-management.onrender.com/tenants/id/edit
- https://tenancy-management.onrender.com/creditors/id/edit
- https://tenancy-management.onrender.com/transactions/id/edit
  
#### FormEditData.js
This component provides a form for user to update record for owner, property, tenant, creditor and transaction.

### URL
- https://tenancy-management.onrender.com/users/id
- https://tenancy-management.onrender.com/owners/id
- https://tenancy-management.onrender.com/properties/id
- https://tenancy-management.onrender.com/tenants/id
- https://tenancy-management.onrender.com/creditors/id
- https://tenancy-management.onrender.com/transactions/id

#### DisplayData.js
This component displays information for user, owner, property, tenant, creditor and transaction; It also provide buttons for user to update and delete record.

### URL
- https://tenancy-management.onrender.com/users/id/edit
- https://tenancy-management.onrender.com/users/id/changestatus

#### FormEditUser.js
This component provides a form for the user to change user's status, update user's basic information or change user's password.

### URL
- https://tenancy-management.onrender.com/owners/id/changeuser
  
#### FormChangeUser.js
This component provides a form for user to change a user for the selected owner.

### DataDisplayingFunctions.js
This component stores functions for other components such as NavBar, DisplayTable, DisplayTableRow, DisplayData, FormEditData etc..

### DataMappingsFields.js
This component stores mappings fields, end points and formik validation for other components such as DisplayData, FormNewData, FormEditData etc..

### App.css
CSS styling sheet for the application.

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


### app.py

There are 16 endpoints (urls) related to Models and database so that front end client can retrive, read, create, update and delete data. 

#### Authentication-Access Control
Data is accessible only to users who have registered accounts.

#### Authorization:
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
   - delete properties that do not have any associated tenants or transactions.
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






