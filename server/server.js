require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err, res) => {
    if (err) throw err;

    console.log('Db conected to localhost:27017/cafe');
});

app.listen(process.env.PORT, () => {
    console.log('escuchando por puerto', process.env.PORT);
});