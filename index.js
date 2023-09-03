const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const chefs = require('./data/chefs.json');
const reviews = require('./data/reviews.json');

const app = express();
const port = 5000;
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@madchef.30s9xap.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

try {
	// Connect the client to the server	(optional starting in v4.7)
	await client.connect();

	const db = client.db('madChef');
	const usersCollection = db.collection('users');

	// * Users related api
	app.get('/user/favorites', async (req, res) => {
		const email = req.query.email;

		console.log(email);
	});

	// Send a ping to confirm a successful connection
	await client.db('admin').command({ ping: 1 });
	console.log(
		'Pinged your deployment. You successfully connected to MongoDB!'
	);
} catch (err) {
	console.error(err);
}

app.get('/chefs', (req, res) => {
	res.send(chefs);
});

app.get('/chefs/name', (req, res) => {
	const names = [];
	chefs.forEach((chef) => {
		let cName = {
			id: chef.id,
			name: chef.name,
			availableRecipes: chef.availableRecipes.length,
		};
		names.push(cName);
	});
	res.send(names);
});

app.get('/chefs/chef/:id', (req, res) => {
	const chef = chefs.find((chef) => chef.id == req.params.id);
	res.send(chef);
});

app.get('/chefs/chef/recipes/:id', (req, res) => {
	const chef = chefs.find((chef) => chef.id == req.params.id);
	res.send(chef.recipes);
});

app.get('/top-chefs', (req, res) => {
	const chefsCopy = chefs;
	const sortedValues = chefsCopy.sort((a, b) => b.rating - a.rating);
	res.send(sortedValues);
});

app.get('/reviews', (req, res) => {
	res.send(reviews);
});

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});
