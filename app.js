const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./db');
const collection = 'todo';

const app = express();
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// read
app.get('/getTodos', (req, res) => {
	db.getDB().collection(collection).find({}).toArray((err, documents) => {
		if (err) {
			console.log(err);
		} else {
			console.log(documents);
			res.json(documents);
		}
	});
});

//
app.put('/:id', (req, res) => {
	const todoID = req.params.id;
	const userInput = req.body;

	db
		.getDB()
		.collection(collection)
		.findOneAndUpdate(
			{ _id: db.getPrimaryKey(todoID) },
			{ $set: { todo: userInput.todo } },
			{ returnOriginal: false },
			(err, result) => {
				if (err) {
					console.log(err);
				} else {
					res.json(result);
				}
			}
		);
});

// insert
app.post('/', (req, res) => {
	const userInput = req.body;
	// database connection
	db.getDB().collection(collection).insertOne(userInput, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.json({ result: result, document: result.ops[0] });
		}
	});
});

// Delte
app.delete('/:id', (req, res) => {
	const todoID = req.params.id;

	// callback func err/result
	db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(todoID) }, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
			res.json(result);
		}
	});
});

// database connection
db.connect((err) => {
	if (err) {
		console.log('unable to connect to database');
		process.exit(1);
	} else {
		app.listen(3000, () => {
			console.log('connected to database, app listening to port 3000');
		});
	}
});
