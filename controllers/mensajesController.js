const { stringify } = require("flatted");
const Mensaje = require("../models/Mensaje");


const obtenerChat = async(req, res) => {

    const miId = req.uid;
    const mensajesDe = req.params.de

    const last30 = await Mensaje.find({
        $or: [
            {de: miId, para: mensajesDe},
            {de: mensajesDe, para: miId}
        ]
    })
    .sort({createdAt: 'asc'})
    .limit(30);

    // console.log(last30);
    res.json({
        ok: true,
        mensajes: last30
    });
}

module.exports = {
    obtenerChat
}
