require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//habiliatar la carpeta public para poder verla desde cualqueir lado
app.use(express.static(path.resolve(__dirname, '../public')));

//rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (err, res) => {
    if (err) throw err;

    console.log('Db conected ');
});

app.listen(process.env.PORT, () => {
    console.log('escuchando por puerto', process.env.PORT);
});