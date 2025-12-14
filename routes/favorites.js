const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const apiKey = process.env.API_KEY;

/* Adding Dog Schema */
const Dog = require("../model/Dog.js");

function addLinks() {
    return  `<hr><a href="/">Return Home</a><br>
            <a href="/dogDetails">Perfect Pet Search</a><br>
            <a href="/favorites">Favorites</a>`;
}

/* Displays favorites which are stored in MongoDB collection */
router.get('/', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

        const dogs = await Dog.find({});

        let favoritedBreeds = 
        `<table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Life Span</th>
                    <th>Temperament</th>
                    <th>Remove From Favorites?</th>
                </tr>
            </thead>
            <tbody>`;

        dogs.forEach(dog => {
            const breedName = dog["name"];

            favoritedBreeds += 
            `<tr>
                <form action="/favorites/removeFavorite?name=${breedName}" method="post">
                    <td>${breedName}</td>
                    <td>${dog["life_span"]}</td>
                    <td>${dog["temperament"]}</td>
                    <td type="button"><button type="submit">Remove</button></td>
                </form>
            </tr>`
        });
        favoritedBreeds += `</tbody></table>`;

        mongoose.disconnect();
        res.render("favorites", { favoritedBreeds });
    } catch(error) {
        console.log(error);
        mongoose.disconnect();

        const links = addLinks();
        res.send(`Error Dislaying Favorites<br> ${links}`);
    }
});

/* Remove favorited breed from MongoDB collection */
router.post("/removeFavorite", async (req, res) => {
    const breedName = req.query.name;
    console.log(breedName);

    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

        await Dog.deleteOne({ name : breedName })
        .then(() => {
            const deletedResult = `Success: <strong>${breedName}</strong> was removed from favorites`;
            res.render("removeFavorite", { deletedResult });
        }).catch(error => {
            console.log(error);
        });

        mongoose.disconnect();
    } catch(error) {
        console.log(error);
        const links = addLinks();
        res.send(`Error Removing From Favorites<br> ${links}`);
    }
});

module.exports = router;