const { usuarioConectado, getUsuarios, usuarioDesconectado, grabarMensaje } = require("../controllers/socketsController");
const { comprobarJWT } = require("../helpers/jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        
        // On connection
        this.io.on('connection', async( socket ) => {
            const [ valido, uid ] = comprobarJWT( socket.handshake.query['x-token'] );
            if ( !valido ) {
                console.log('Socet no identificado');
                return socket.disconnect();
            }

            await usuarioConectado( uid );

            // unir el usuario a una sala de socket.io
            socket.join( uid );

            // TODO: validar el jwt
            // si el token no es valido, desconectar
            
            // TODO: saber que usuario esta conectado mediante el uid

            // TODO: emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios());

            // TODO: socket join

            // TODO:  escuchar cuando el cliente anda un mensaje
            // mensaje personal
            socket.on('mensaje-personal', async(payload) => {
                const mensaje = await grabarMensaje( payload );
                this.io.to( payload.para ).emit('mensaje-personal', mensaje);
                this.io.to( payload.de ).emit('mensaje-personal', mensaje);
            })

            // TODO: disconnect
            // marcar en la db que el usuario esta desconectado

            // TODO: emitir todos los usuarios conectados

            socket.on('disconnect', async() => {
                await usuarioDesconectado( uid );

                this.io.emit('lista-usuarios', await getUsuarios());
            })
        
        });
    }


}


module.exports = Sockets;