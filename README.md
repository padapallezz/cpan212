What we've done:
1. Creating JSON file and added sample data for each entity.
1. Apply Modular Architecture to our project.
2. Add Application-Level Middlewares: Global error handler, json parse, urlEncode, 404 route not found.
3. Handled logics in each module's model including: 
    - getAll<Entity>() → Fetch all records
    - get<Entity>ByID(id) → Fetch a single record
    - addNew<Entity>(data) → Add a new record
    - updateExisting<Entity>(id, data) → Update a record
    - delete<Entity>(id) 

