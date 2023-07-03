const express = require("express");
const chefs = require("./data/chefs.json");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors())

app.get("/chefs", (req, res) => {
	res.send(chefs);
});

app.get("/chefs/name", (req, res) =>{
    const names = [];
    chefs.forEach(chef => {
        let cName = {
            id: chef.id,
            name: chef.name,
            availableRecipes: chef.availableRecipes.length
        }
        names.push(cName)
    })
    res.send(names)
})

app.listen(port, () => {
	console.log(`Server running on ${port}`);
});
