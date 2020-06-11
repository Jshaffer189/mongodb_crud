const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// database name
const dbname = 'crud_mongodb';

// local database location
const url = 'mongodb://localhost:27017';

// pass in options
const mongoOptions = { useNewUrlParser: true };

// state
const state = {
	db: null
};

// default connection method
const connect = (cb) => {
	// if there is a database connection use callback
	if (state.db) {
		db();
		// if there isnt a database connection use mongb client to connect to database
	} else {
		MongoClient.connect(url, mongoOptions, (err, client) => {
			if (err) {
				cb(err);
			} else {
				// if no error set the state
				state.db = client.db(dbname);
				cb();
			}
		});
	}
};

const getPrimaryKey = (_id) => {
	return ObjectID(_id);
};

const getDB = () => {
	return state.db;
};

module.exports = { getDB, connect, getPrimaryKey };
