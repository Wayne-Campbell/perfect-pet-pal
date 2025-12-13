// require("dotenv").config({
//    path: path.resolve(__dirname, "credentialsDontPost/.env"),
// });

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

//connect to the mongo db database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true});
const db = mongoose.connection;
// (async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
//         console.log("Hello");
//         mongoose.disconnect();
//     } catch(err) {
//         console.error(err);
//     }
// })();


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

app.use("/", (req, res) => {
    res.send("/ in server.js");
});


//show that the server started
app.listen(portNumber, () => console.log(`Server started on: http://localhost:${portNumber}/`));

