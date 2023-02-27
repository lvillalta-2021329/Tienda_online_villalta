const { Router } = require('express');
const { check } = require('express-validator');

const { existeProductoPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

//Controllers
const { obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto } = require('../controllers/producto');

const router = Router();

// Obtener todas los productos - publico
router.get('/', obtenerProductos);

// Obtener un producto por el id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProductoPorId);

// Crear Producto - privado - cualquier persona con un token valido
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

// Actualizar Producto - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    validarCampos
], actualizarProducto);

// Borrar una categoria - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto);

module.exports = router;
