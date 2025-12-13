What we've done: 1, 2, 3, 4 (My Tran); 5, 6, 7, 8 (Anh Truong)
1. Creating JSON file and added sample data for each entity.
2. Apply Modular Architecture to our project .
3. Add Application-Level Middlewares: Global error handler, json parse, urlEncode, 404 route not found.
4. Handled logics in each module's model including: 
    - getAll<Entity>() → Fetch all records
    - get<Entity>ByID(id) → Fetch a single record
    - addNew<Entity>(data) → Add a new record
    - updateExisting<Entity>(id, data) → Update a record
    - delete<Entity>(id) 


<!-- 5. Implement Independent Routes: 
    -Created routes for each module: user-route, forecast-route, revenue-route.js, what-if-route.js
    Each uses Express.Router() and connects to its own model
6. Add Route-Level Middlewares:
-using express-validator for POST and PUT in each module
-centralized them in middlewares/validators.js
7.Validate Required Fields, Data Types, and 
8. Return Proper HTTP Responses
200 OK for successful GET, PUT, DELETE
201 Created for successful POST
400 Bad Request for validation errors via express-validator
404 Not Found when a record is missing
500 Internal Server Error for unexpected exceptions -->


Phase 3
Anh:
- Set up MongoDB Atlas cluster and database.
- Installed dotenv for env vars and added to .gitignore.
- Created connectDB middleware in shared/middlewares/connect-db.js.

My Tran
- Create Mongoose Schemas inside each module's models folder
- Replace previous JSON-based logic with actual Mongoose CRUD operations for each module.
- Enhance your GET routes with filtering options, update post, put, delete methods.


 
 Phase 4 Frontend

Anh;
- Set up react app
- create Forms for BEP, Revenue, Forecast, What-If
-  Implement list components: BepList, RevenueList, WhatIfList, ForeCastList with delete
- Created pages for list, add, edit
- Testing
- Configured React Router
- Added basic form validation 
My Tran
- building UI for all modules
- API integrate
- form validation (frontend)
- testing

Phase 5:
Authentication and Authoriztion: Anh Truong(user, bep), MyTran(revenue, whatif)
