const express = require("express");
const cors = require("cors");
const chefs = require("./data/chefs.json");
const reviews = require("./data/reviews.json");

const app = express();
const port = 5000;

app.use(cors());

app.get("/chefs", (req, res) => {
	res.send(chefs);
});

app.get("/chefs/name", (req, res) => {
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

app.get("/chefs/chef/:id", (req, res) => {
	const chef = chefs.find((chef) => chef.id == req.params.id);
	res.send(chef);
});

app.get("/chefs/chef/recipes/:id", (req, res) => {
	const chef = chefs.find((chef) => chef.id == req.params.id);
	res.send(chef.recipes);
});

app.get("/top-chefs", (req, res) => {
	const sortedValues = chefs.toSorted((a, b) => b.rating - a.rating);
	res.send(sortedValues);
});

app.get("/reviews", (req, res) => {
	res.send(reviews);
});

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});
