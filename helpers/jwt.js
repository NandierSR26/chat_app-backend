const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid
        }
        const token = jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        }, ( err, token ) => {
            if ( err ) {
                console.log(err);
                reject('Error al generar el token');
            } else {
                resolve(token);
            }
        })
        return token;
    })
}

const comprobarJWT = ( token = '' ) => {
    try {
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );

        return [ true, uid]
    } catch (error) {
        return [ false, null ]
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}