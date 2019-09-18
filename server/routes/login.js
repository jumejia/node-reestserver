const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const app = express();
const _ = require('underscore');

const jwt = require('jsonwebtoken');

//login
app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            })
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            })
        }

        //token expira en 30 días
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            expiraEn: process.env.CADUCIDAD_TOKEN
        })

    })
})

module.exports = app;