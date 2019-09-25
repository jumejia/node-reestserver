const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenUrl } = require('../middlewares/autenticacion')

let app = express();


app.get('/imagen/:tipo/:img', verificaTokenUrl, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);



    if (fs.existsSync(pathImagen)) {
        console.log(pathImagen);
        res.sendFile(pathImagen);
    } else {
        let pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(pathNoImg);
    }

});

module.exports = app;