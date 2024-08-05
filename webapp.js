const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://taklatina:pepsimaxi1!@cluster0.r41lzxh.mongodb.net/';

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function main() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('Assignment10');  // Replace with your database name
        const collection = db.collection('places');  // Replace with your collection name

        // Home route
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'home.html'));
        });

        // Handle form submission from home.html
        app.post('/submit', async (req, res) => {
            const formData = req.body;
            try {
                await collection.insertOne(formData);
                res.redirect('/results-page');
            } catch (err) {
                console.error("Error inserting data:", err);
                res.status(500).send("Internal Server Error");
            }
        });

        // Results route
        app.get('/results', async (req, res) => {
            try {
                const results = await collection.find({}).toArray();
                res.json(results);
            } catch (err) {
                console.error("Error fetching data:", err);
                res.status(500).send("Internal Server Error");
            }
        });

        // Serve results.html
        app.get('/results-page', (req, res) => {
            res.sendFile(path.join(__dirname, 'views', 'results.html'));
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main().catch(console.error);

