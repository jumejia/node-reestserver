const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

//configuración necesaria para cagar archivos
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado ningún archivo"
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Los tipos válidos son: " + tiposValidos.join(', ')
        });
    }


    let archivo = req.files.archivo;

    if (archivo.length > 1)
        return res.status(400).json({ ok: false, message: "Máximo un archivo por carga" });


    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    //extension permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Archivo no válido, solo imágenes! " + extensionesValidas.join(', '),
            extensionCargada: extension
        });
    }

    //cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, err });


        //imagen cargada
        if (tipo === 'usuarios')
            return imagenUsuario(id, res, nombreArchivo, tipo);

        if (tipo === 'productos')
            return imagenProducto(id, res, nombreArchivo, tipo);
    });
})


function imagenUsuario(id, res, nombreArchivo, tipo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({ ok: false, err: { message: "El usuario no existe" } });
        }

        //se elimina la foto anterior del usuario.
        borraArchivo(usuarioDB.img, tipo);

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err)
                return res.status(500).json({ ok: false, err });

            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });
        })

    })
}

function imagenProducto(id, res, nombreArchivo, tipo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({ ok: false, err: { message: "El usuario no existe" } });
        }

        //se elimina la foto anterior del usuario.
        borraArchivo(productoDB.img, tipo);

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err)
                return res.status(500).json({ ok: false, err });

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        })

    })
}

//elimina el archivo deseado
function borraArchivo(nombreArchivo, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}



module.exports = app;