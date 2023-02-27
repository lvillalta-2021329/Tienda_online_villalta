//Importacion
const { response, request } = require('express');
//Modelos
const Factura = require('../models/factura');

const obtenerFacturas = async (req = request, res = response) => {

    //Condición, me busca solo la factura que tengan estado en true
    const query = { estado: true };

    const listaFacturas = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query)
            .populate('usuario', 'nombre')
            .populate('producto', 'nombre')
    ]);

    res.json({
        msg: 'GET API de factura',
        listaFacturas
    });

}

const obtenerFacturaPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const factura = await Factura.findById(id)
        .populate('usuario', 'nombre')
        .populate('producto', 'nombre');

    res.json({
        msg: 'factura por id',
        factura
    });

}


const crearFactura = async (req = request, res = response) => {
    //operador spread
    const { estado, usuario, ...body } = req.body;

    //validación si existe un factura en la db
    const facturaEnDB = await Factura.findOne({ nombre: body.nombre });

    if (facturaEnDB) {
        return res.status(400).json({
            mensajeError: `El factura ${facturaEnDB.nombre} ya existe en la DB`
        });
    }


    //Generar data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const factura = new Factura(data);

    //Guardar en DB
    await factura.save();

    res.status(201).json({
        msg: 'Post factura',
        factura
    });


}


const actualizarFactura = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id; //hacemos referencia al usuario que hizo el put por medio del token

    //Edición de producto               // new: true Sirve para enviar el nuevo documento actualizado     
    const factura = await Factura.findByIdAndUpdate(id, data, { new: true });

    res.json({
        msg: 'Put de factura',
        factura
    });

}


const eliminarFactura = async (req = request, res = response) => {

    const { id } = req.params;
    const facturaBorrado = await Factura.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: 'delete factura',
        facturaBorrado
    });

}



module.exports = {
    obtenerFacturas,
    obtenerFacturaPorId,
    crearFactura,
    actualizarFactura,
    eliminarFactura
}