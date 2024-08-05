const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

const uri = 'mongodb+srv://taklatina:pepsimaxi1!@cluster0.r41lzxh.mongodb.net/Assignment10?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Connection error:', err);
    }
}

main();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/process', async (req, res) => {
    const query = req.body.query;
    try {
        const db = client.db('Assignment10');
        const collection = db.collection('places');
        
        let place;
        if (isNaN(query.charAt(0))) {
            place = await collection.findOne({ place: query });
        } else {
            place = await collection.findOne({ zips: query });
        }
        
        if (place) {
            res.render('results', { place: place.place, zips: place.zips });
        } else {
            res.render('results',{place: null, zips:[] });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

