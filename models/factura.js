const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del factura es obligatorio'],
        unique: true
    }, 
    descripcion: { 
        type: String 
    },
    cantidadProducto: { 
        type: Number,
        default: 0
    },
    
    precioProducto: {
        type: Number,
        default: 0
    },
    totalProducto: { 
        type: Number,
        default: 0
    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }, 
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }
});

module.exports = model('Factura', FacturaSchema);