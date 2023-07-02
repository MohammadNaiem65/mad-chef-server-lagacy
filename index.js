const express = require("express");
const chefs = require("./data/chefs.json");
const app = express();
const port = 5000;

app.get("/chefs", (req, res) => {
	res.send(chefs);
});

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});
