const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Joi = require('joi');

const db = require('./db');
// name of table/collection
const collection = 'todo';

const app = express();
app.use(bodyParser.json());

const schema = Joi.object().keys({
	// requires a string, not empty,
	todo: Joi.string().required()
});

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

// update
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

// Create
app.post('/', (req, res) => {
	const userInput = req.body;

	Joi.validate(userInput, schema, (err, next) => {
		if (err) {
			const error = new Error('Invalid input');
			err.status = 400;
			next(error);
		} else {
			// database connection
			db.getDB().collection(collection).insertOne(userInput, (err, result) => {
				if (err) {
					const error = new Error('Failed to insert Todo Document');
					error.status = 400;
					next(error);
				} else
					res.json({
						result: result,
						document: result.ops[0],
						msg: 'Successfully inserted Todo!!!',
						error: null
					});
			});
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

app.use((err, req, res, next) => {
	res.status(err.status).json({
		error: {
			message: err.message
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
