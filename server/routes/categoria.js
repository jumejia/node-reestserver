const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');
const _ = require('underscore');

let app = express();

//listado de categorías
app.get('/categoria', [verificaToken], (req, res) => {

    Categoria.find({})
        .sort({ nombre: 1 })
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.estimatedDocumentCount({ estado: true }, (err, totalRegistros) => {
                res.json({
                    ok: true,
                    totalRegistros,
                    categorias
                })
            });
        });
});

//categoría por ID
app.get('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'estado', 'usuario', 'fecha']);

    Categoria.findById(id, body, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No existe el registro"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

//crear categoría
app.post('/categoria', [verificaToken], (req, res) => {

    let category = req.body;

    let categoria = new Categoria({
        nombre: category.nombre,
        estado: category.estado,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//actualizar categoría
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    console.log(id);

    let body = { nombre: req.body.nombre };

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "No existe el registro"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//borrar categoría
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    console.log(id);

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }


        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            })
        }


        res.json({
            ok: true,
            message: "Categoría borrada"
        })

    });
});






module.exports = app;