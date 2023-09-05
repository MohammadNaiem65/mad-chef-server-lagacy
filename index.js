const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
		const chefsCollection = db.collection('chefs');
		const usersCollection = db.collection('users');
		const recipesCollection = db.collection('recipes');
		const reviewCollection = db.collection('reviews');

		// * Chef related api
		app.get('/chefs', async (req, res) => {
			const chefs = await chefsCollection.find().toArray();
			res.send(chefs);
		});

		app.get('/chefs/name', async (req, res) => {
			const options = {
				projection: { _id: 1, name: 1, availableRecipes: 1 },
			};

			const chefsNames = await chefsCollection
				.find({}, options)
				.toArray();
			res.send(chefsNames);
		});

		app.get('/chefs/chef/:id', async (req, res) => {
			const _id = new ObjectId(req.params.id);
			const chef = await chefsCollection.findOne({ _id });
			res.send(chef);
		});

		app.get('/chefs/chef/recipes/:id', async (req, res) => {
			const chef_id = req.params.id;

			const recipes = await recipesCollection.find({ chef_id }).toArray();
			res.send(recipes);
		});

		app.get('/top-chefs', async (req, res) => {
			const topChefs = await chefsCollection
				.aggregate([
					{
						$sort: {
							rating: -1,
						},
					},
					{
						$limit: 6,
					},
				])
				.toArray();
			res.send(topChefs);
		});

		// * Users related api
		app.post('/users/user', async (req, res) => {
			const userData = req.body;

			const result = await usersCollection.insertOne(userData);
			console.log(userData, result);
			res.send(result);
		});

		app.get('/users/user/check', async (req, res) => {
			const email = req.query.email;

			const result = await usersCollection.findOne({ email });
			if (result) {
				console.log(result);
				return res.send({ exist: true });
			} else {
				console.log(result);
				return res.send({ exist: false });
			}
		});

		app.get('/users/user/favorites', async (req, res) => {
			const email = req.query.email;
			const options = {
				projection: {
					favorites: 1,
					_id: 0,
				},
			};

			const result = await usersCollection.findOne({ email }, options);
			if (result) {
				res.send(result);
			} else {
				res.send({ favorites: [] });
			}
		});

		app.patch('/users/user/favorites/:id', async (req, res) => {
			const id = req.params.id;
			const email = req.query.email;
			const result = await usersCollection.updateOne(
				{ email },
				{ $addToSet: { favorites: id } }
			);

			console.log(result);
			res.send(result);
		});

		// * Review related api
		app.get('/reviews', async (req, res) => {
			const reviews = await reviewCollection.find().toArray();
			res.send(reviews);
		});
	} catch (err) {
		console.error(err);
	}
}
run();

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});
