const express = require('express');
const router = express.Router();



router.get('/', (req, res) => {
    res.send('Dog Details Home Page');
    //we will have a template and render just the dog details main page
})

module.exports = router;