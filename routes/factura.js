const { Router } = require('express');
const { check } = require('express-validator');

const { existeFacturaPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

//Controllers
const { obtenerFacturas,
    obtenerFacturaPorId,
    crearFactura,
    actualizarFactura,
    eliminarFactura, 
    } = require('../controllers/factura');

const router = Router();

// Obtener todas los factura - publico
router.get('/', obtenerFacturas);

// Obtener un factura por el id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeFacturaPorId),
    validarCampos
], obtenerFacturaPorId);

// Crear factura - privado - cualquier persona con un token valido
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre del factura es obligatorio').not().isEmpty(),
    validarCampos
], crearFactura);

// Actualizar factura - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeFacturaPorId),
    check('nombre', 'El nombre del factura es obligatorio').not().isEmpty(),
    validarCampos
], actualizarFactura);

// Borrar una categoria - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeFacturaPorId),
    validarCampos
], eliminarFactura);

module.exports = router;
