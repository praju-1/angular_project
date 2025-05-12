const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const multer = require('multer');
const env = require('dotenv')
env.config()

const app = express();
app.use(cors());
app.use(express.json()); // optional, helps if you want JSON parsing in future

const CONNECTION_STRING = process.env.DB_collection;

const DATABASENAME = 'todoangular';
let database;

// Connect to MongoDB before starting server
MongoClient.connect(CONNECTION_STRING)
    .then(client => {
        database = client.db(DATABASENAME);
        console.log("MongoDB connection successful");

        // Start server after DB is connected
        app.listen(5038, () => {
            console.log("Server is running on port 5038");
        });
    })
    .catch(error => {
        console.error("MongoDB connection failed:", error);
    });

// Routes

app.get('/api/todoapp/Getnotes', (request, response) => {
    database.collection('todo').find({}).toArray((error, result) => {
        response.send(result);
    });
});

app.post('/api/todoapp/Addnotes', multer().none(), (request, response) => {
    database.collection('todo').countDocuments({},function(error, numOfDocs){
         database.collection('todo').insertOne({
            id: (numOfDocs + 1).toString(),
            city: request.body.newNotes
        })
            response.json("Added successfully");
        });
    });

app.delete('/api/todoapp/DeleteNotes', (request, response) => {
    database.collection('todo').deleteOne({ id: request.query.id 

    })
        response.json("Deleted successfully");
    });
