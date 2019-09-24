const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    fecha: {
        type: Date,
        default: new Date(),
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);