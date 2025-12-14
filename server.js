// const { error } = require('console');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const portNumber = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

//define template files location
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));

/* uncomment for local testing */
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});



//open the connection to the database, check for errors or success
// const db = mongoose.connection;


// db.on('error',(console)=> console.error(error));
// db.once('open', () => console.log('Connected'));

//our API return JSON, so we need json middleware
app.use(express.json());

//serve static css file
const publicPath = path.resolve(__dirname, "serverStaticFiles");
app.use(express.static(publicPath));

//bring in the routes from the routes folder
const dogDetailsRouter = require('./routes/dogDetails');

//use the routes
app.use('/dogDetails', dogDetailsRouter);


/* Adding Dog Schema */
const Dog = require("./model/Dog.js");

app.use("/", async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

        mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }

    res.render("homePage");
});


//show that the server started
app.listen(portNumber, () => console.log(`Server started on: http://localhost:${portNumber}/`));

