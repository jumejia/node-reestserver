const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const bcrypt = require('bcrypt');
const _ = require('underscore');

//get
app.get('/usuario', verificaToken, (req, res) => {

    let pagina = Number(req.query.pagina) || 0;
    let registros = Number(req.query.registros) || 5;



    Usuario.find({ estado: true }, 'nombre email role estado google fecha')
        .sort({ fecha: -1 })
        .skip(pagina)
        .limit(registros)

    .exec((err, usuarios) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Usuario.estimatedDocumentCount({ estado: true }, (err, totalRegistros) => {
            res.json({
                ok: true,
                totalRegistros,
                usuarios
            })
        });
    });
});

//create
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    let user = req.body;

    let usuario = new Usuario({
        nombre: user.nombre,
        email: user.email,
        password: bcrypt.hashSync(user.password, 10),
        role: user.role
    });

    usuario.save((err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDb
        });
    });
})


//update
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    body.fecha = new Date();

    console.log(body);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({ ok: true, usuario: usuarioDb });
    })
})

//delete
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = { estado: false };
    Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
});

module.exports = app;