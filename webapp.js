const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://taklatina:pepsimaxi1!@cluster0.r41lzxh.mongodb.net/';

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

        // Process route
        app.post('/process', async (req, res) => {
            const input = req.body.input;
            let query;

            if (/^\d/.test(input)) {
                query = { zipCode: input };
            } else {
                query = { place: input };
            }

            try {
                const results = await collection.find(query).toArray();
                res.render('results', { results });
            } catch (err) {
                console.error("Error fetching data:", err);
                res.status(500).send("Internal Server Error");
            }
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

