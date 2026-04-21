// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('5000');

// Create a new document in the collection.
db.getCollection('users').insertOne({

    role: 'admin', 
    name: 'John Doe',
    email: 'john@gmail.com',
    password: ''
});
