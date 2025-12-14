const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const apiKey = process.env.API_KEY;

function addLinks() {
    return  `<hr><a href="/">Return Home</a><br>
            <a href="/dogDetails">Perfect Pet Search</a><br>
            <a href="/favorites">Favorites</a>`;
}

router.get('/', (req, res) => {
    res.render("searchPage");
})

/* Adding Dog Schema */
const Dog = require("../model/Dog.js");

/* Sends a GET request to API to list all specific breeds of the generic breed that was searched */
router.post("/searchResults", async (req, res) => {
    const breed = req.body.breed;

    const url = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`;
    try {
        const response = await fetch(url,
            {
                headers: {
                    "x-api-key": apiKey
                }
            }
        );
        const json = await response.json();
        let breeds = `<table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Life Span</th>
                    <th>Temperament</th>
                    <th>Save As Favorite?</th>
                </tr>
            </thead>
            <tbody>`;
        
        json.forEach(breed => {
            const id = breed["id"];
            const name = breed["name"];
            const life_span = breed["life_span"];
            const temperament = breed["temperament"];

            breeds += 
            `<tr>
                <form action="/dogDetails/saveBreed?id=${id}" method="post">
                    <td>${name}</td>
                    <td>${life_span}</td>
                    <td>${temperament}</td>
                    <td type="button"><button type="submit">Save</button></td>
                </form>
            </tr>`;
        });
        breeds += `</tbody></table>`

        res.render("searchResults", { breeds });
    } catch (error) {
        console.error("Error: " + error);
        res.send("Breed Not Found");
    }
});

/* When Save is clicked, it will save the specific breed to MongoDB */
router.post("/saveBreed", async (req, res) => {
    const id = req.query.id;

    /* Adding links to bottom of page */
    const links = addLinks();

    const url = `https://api.thedogapi.com/v1/breeds/${id}`;
    try {
        const response = await fetch(url,
            {
                headers: {
                    "x-api-key": apiKey
                }
            }
        );
        const breed = await response.json();

        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        
        const filter = { name: breed["name"] };
        const result = await Dog.findOne(filter);
        if (!result) {
            await Dog.create({
                id: id,
                name: breed["name"],
                life_span: breed["life_span"],
                temperament: breed["temperament"]
            });
        } else {
            res.send(`<strong>Error:</strong> Breed Already Saved to Favorites<br> ${links}`);
        }

        mongoose.disconnect();
        res.send(`<strong>${breed["name"]}</strong> saved to favorites<br> ${links}`);
    } catch(error) {
        console.error("Error: " + error);
        res.send(`<strong>Error Saving to Favorites</strong><br> ${links}`);
    }
});

module.exports = router;