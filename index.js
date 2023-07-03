const express = require("express");
const chefs = require("./data/chefs.json");
const cors = require("cors");
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

app.get("/chefs/chef/recipes/:id", (req, res)=>{
    const chef = chefs.find((chef) => chef.id == req.params.id);
    res.send(chef.recipes);
})

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});
