require('dotenv').config();

//express and mongoose setup
const { error } = require('console');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//connect to the mongo db database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true});

//open the connection to the database, check for errors or success
const db = mongoose.connection;
db.on('error',(console)=> console.error(error));
db.once('open', () => console.log('Connected'));

//our API return JSON, so we need json middleware
app.use(express.json());

//bring in the routes from the routes folder
const dogDetailsRouter = require('./routes/dogDetails');

//use the routes
app.use('/dogDetails', dogDetailsRouter);

//show that the server started
app.listen(3000, () => console.log('Server Started on Port 3000'));