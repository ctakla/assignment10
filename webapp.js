const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const url = 'mongodb+srv://taklatina:pepsimaxi1!@cluster0.mongodb.net/Assignment10?retryWrites=true&w=majority';
const dbName = 'Assignment10';

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let db, collection;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
  db = client.db(dbName);
  collection = db.collection('places');
  console.log('Connected to MongoDB Atlas');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.post('/process', async (req, res) => {
  const query = req.body.query;
  const isZip = !isNaN(query.charAt(0));

  let result;
  if (isZip) {
    result = await collection.findOne({ zips: query });
  } else {
    result = await collection.findOne({ place: query });
  }

  if (result) {
    res.render('result', { result });
  } else {
    res.send('No results found');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

