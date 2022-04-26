/* path: api/login */

const {Router} = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/authController');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

// crear nuevos usuarios
router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario)

// login
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
],login);

// revalidar
router.get('/renew', validarJWT,renewToken)

module.exports = router;