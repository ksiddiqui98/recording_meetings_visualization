const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/cisl', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

//set up static files
app.use(express.static('public'));

app.use(bodyParser.json());
// initialize routes
app.use('/users', require('./api/routes/users'));
app.use('/speech', require('./api/routes/speeches'));


// error handling middleware
app.use(function (err, req, res, next) {
    console.log(err); // to see properties of message in our console
    res.status(500).send({ error: err.message });
});

// listen for requests
app.listen(process.env.port || 8000, function () {
    console.log('Now listening for requests');
});