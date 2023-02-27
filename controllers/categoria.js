//Importacion
const { response, request } = require('express');
//Modelos
const Categoria = require('../models/categoria');

const obtenerCategorias = async (req = request, res = response) => {

    //Condición, me busca solo los categorias que tengan estado en true
    const query = { estado: true };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre')
    ]);

    res.json({
        msg: 'GET API de usuarios',
        listaCategorias
    });


}

const obtenerCategoriaPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');

    res.json({
        msg: 'categoria por id',
        categoria
    });

}


const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    //Validación para encontar una cateroia por nombre en la DB
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Guardar en DB
    await categoria.save();

    res.status(201).json({
        msg: 'Post de categoria',
        categoria
    });

}


const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase(); //cambiamos el nombre todo a mayusculas
    data.usuario = req.usuario._id; //hacemos referencia al usuario que hizo el put por medio del token

    //Edición de categoria                                         // new: true Sirve para enviar el nuevo documento actualizado     
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({
        msg: 'Put de categoria',
        categoria
    });

}


const eliminarCategoria = (req = request, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'delete categoria',
        id
    });

}



module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}