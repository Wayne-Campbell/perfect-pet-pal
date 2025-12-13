const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("homePage");
    //we will have a template and render just the dog details main page
})

router.post("/searchResults", (req, res) => {
    const breed = req.body;
    res.render("searchResults", breed);
});

module.exports = router;