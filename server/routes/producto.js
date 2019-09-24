const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto');
const _ = require('underscore');

let app = express();

//productos pro ID

app.get('/producto/:id', [verificaToken], (req, res) => {

    Producto.find({ _id: req.params.id })
        .sort({ nombre: 1 })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre fecha')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.estimatedDocumentCount({ estado: true }, (err, totalRegistros) => {
                res.json({
                    ok: true,
                    totalRegistros,
                    categorias
                })
            });
        });
});

//productos listado
app.get('/producto', [verificaToken], (req, res) => {

    let pagina = Number(req.query.pagina) || 0;
    let registros = Number(req.query.registros) || 5;


    Producto.find({ disponible: true })
        .sort({ nombre: 1 })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre fecha')
        .skip(pagina)
        .limit(registros)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.estimatedDocumentCount({ estado: true }, (err, totalRegistros) => {
                res.json({
                    ok: true,
                    totalRegistros,
                    productos
                })
            });
        });
});

//update producto
app.put('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    let user = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    }

    console.log(user);

    Producto.findByIdAndUpdate(id, user, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No existe el registro"
                }
            })
        }

        res.json({
            ok: true,
            categoria: productoDB
        });
    });
});


//crear producto
//brabar el usario
//grabar la categoría
app.post('/producto', [verificaToken], (req, res) => {

    let id = req.params.id;
    let pro = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);
    let producto = new Producto(pro);
    producto.usuario = req.usuario._id;

    console.log(producto);

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No existe el registro"
                }
            })
        }

        res.json({
            ok: true,
            categoria: productoDB
        });

    });
});


//borrar producto
//inactivar el producto
app.delete('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no encontrado"
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: "Producto borrado"
        })

    })

});


//búsqueda de productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regExp = new RegExp(termino, 'i');

    Producto.find({ nombre: regExp })
        .sort({ nombre: 1 })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre fecha')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        });
})

module.exports = app;