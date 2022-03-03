const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const {usuarioConectado, usuarioDesconectado} = require('../controllers/socket');


// Mensajes de Sockets
io.on('connection',(client) => {
    
    //console.log('Cliente conectado');
    //cliente con JWT
    const [valido, uid] = comprobarJWT (client.handshake.headers['x-token']);

    //Verificar  autenticación
    if( !valido ) { return client.disconnect();}
    
    //Cliente Autenticado //console.log('cliente autenticado')
    usuarioConectado(uid);

    //Ingresar al usuario a una sala en particular
    //sala global, client.id, 
    client.join(uid);

    //escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', (payload) =>{
        console.log(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    })
    

    client.on('disconnect', () => {
        //console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });

});
