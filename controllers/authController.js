const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/Usuario");

const crearUsuario = async(req, res = response) => {
    try {
        const {email, password} = req.body;

        const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }

        const usuario = new Usuario(req.body);
        
        // encriptar contraseña
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        // guardar usuario en la db
        await usuario.save();

        // generar el jwt
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const login = async(req, res) => {

    const { email, password } = req.body;

    try {
        // verificar que el correo exista
        const usuarioDB = await Usuario.findOne({email});
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        // validar el password
        const validPassword = await bcryptjs.compare(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es correcto'
            })
        }

        // generar el jwt
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })    
    }
}

const renewToken = async(req, res) => {
    const uid = req.uid;

    // generar un nuevo jwt
    const token = await generarJWT(uid);

    // obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}