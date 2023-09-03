const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const chefs = require('./data/chefs.json');
const reviews = require('./data/reviews.json');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@madchef.30s9xap.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		client.connect();
		const db = client.db('madChef');

		// ! Get the collections
		const usersCollection = db.collection('users');

		// * Chef related api
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

		// * Users related api
		app.post('/users/user', async (req, res) => {
			const userData = req.body;

			const result = await usersCollection.insertOne(userData);
			res.send(result);
		});

		// * Review related api
		app.get('/reviews', (req, res) => {
			res.send(reviews);
		});

		// Send a ping to confirm a successful connection
		// client.db('admin').command({ ping: 1 });
		// console.log(
		// 	'Pinged your deployment. You successfully connected to MongoDB!'
		// );
	} catch (err) {
		console.error(err);
	}
}
run();

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});
