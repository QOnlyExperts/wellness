const {Server} = require('socket.io')
const config = require('../../config');
// const {verifyTokenSocket} = require('../utils/auth')

// const RequestController = require('./requestController')
// const UserController = require('./userController')

let io

function configSocket(server){
  io = new Server(server, {
    cors: {
      origin: "*",
      // credentials: true,
      methods: ["GET", "POST"],
    }
    
  })

  const admins = new Set() // Almacena los ID de administradores
  const clients = new Set() // Almacena los ID de clientes
  // const userC = new UserController()
  // const request = new RequestController()

  io.use(async(socket, next) => {
    // const token = socket.handshake.query.token
    // const valid = verifyTokenSocket(token)
    const valid = {
      success: true
    }

    if(!valid.success){
      return next()
    }

    return next()
  })

  io.on('connection', (socket) => {
    // console.log(`Usuario conectado. SocketId: ${socket.id}`)
    // Control de solicitudes 
    // Este se emite desde el Frontend
    // Sala de administradores
    socket.on('joinAsAdmin', async(user) => {
      // const result = await userC.getUserByEmail(user.email)
      const result = {
        res:{
          rol: 'admin'
        }
      }

      if(result.res.rol !== 'admin'){
        return
      }

      // console.log('admin')
      admins.add(socket.id) // Se guarda el id del usuario que haya entrado a la sala joinAsAdmin
      // Solo administradores entran
      socket.join('adminRoom') // Sala para que solo administradores reciban solicitudes a responder
    })

    // Sala inicial o home de clientes
    // Este se emite desde el Frontend y es para refrescar el home cuando haya actualización
    socket.on('joinAsClient', async(user) => {
      // const result = await userC.getUserByEmail(user.email)
      const result = {
        res:{
          rol: 'student'
        }
      }

      if(result.res.rol !== 'student'){
        return
      }

      // console.log('student')
      clients.add(socket.id) // Se guarda el id del usuario que haya entrado a la sala joinAsClient
      // Solo clientes entran
      socket.join('clientRoom') // Sala para que solo administradores reciban solicitudes a responder
    })

    // Este se emite desde el Frontend
    // Solicita el instrumento al administrador para que sea aprobado y regresa el mensaje al usuario que solicito el instrumento
    socket.on('requestInstrumentToAdmin', async(data) => {
      // id de instrumento
      const {idInstrument, user} = data // Para destructurar el objeto

      // Creamos la solicitud
      // const result = await request.create(idInstrument, user._id)
      const result = {
        success: true,
        request: '64b8f3f4e4b0c4a5f6d7e8c9',
        message: 'Solicitud creada correctamente'
      }
      if(!result.success){
        // Ingreso a la sala pero no emito al frontend del administrador

        // Respondemos el mensaje al cliente en caso de que el instrumento solicitado este en uso o tenga instrumentos en uso
        io.to(socket.id).emit('adminResponseToClient', {requ: result?.message})
        
        return
      }
      const newData = JSON.parse(JSON.stringify(data));
      newData.user.clientId = socket.id;
      newData.requestId = result.request
      // Enviamos la solicitud creada al administrador para que le de un estado
      // Se envía el mensaje a la sala de todos los administradores para que acepten o nieguen la solicitud al cliente
      io.to('adminRoom').emit('adminRequestFromClient', newData)
      
    })

    // Responde al cliente para que visualice si su solicitud fue aprobada o no
    socket.on('responseToClient', async(data) => {
      // const {id, requ, user} = 
      const {id, requ, user} = {
        id: 1,
        requ: 1,
        user: 'andres'
      } // Para destructurar el objeto
      // console.log(`Respuesta a ${user.clientId} es ${requ} instrumento ${id}`)
      // const result = await request.updateRequests(id, requ, user._id)
      const result = {
        success: true,
        message: 'Solicitud actualizada correctamente'
      }
      // console.log(result)
      if(!result.success){
        // io.to(user.clientId).emit('adminResponse', {requ: result?.message})
        return
      }

      //Se envía un mensaje a todos los de la sala de clientes para refrescar la pagina inicial 
      io.to('clientRoom').emit('refreshClientRoom', { requ: true })

      // Para darle una respuesta individual al cliente de la solicitud
      io.to(user.clientId).emit('adminResponseToClient', {requ}) 

    })

    // Se utiliza para enviar un mensaje a la sala de todos los clientes y refrescar la pagina para que se visualice el estado después del uso del instrumento que es un no uso
    socket.on('deleteInstrumentInUse', async(data) => {
      // const {idInstrument, user} = data // Para destructurar el objeto
      const {idInstrument, user} = {
        idInstrument: '64b8f3f4e4b0c4a5f6d7e8c9',
        user: 'andres'
      } // Para destructurar el objeto

      // Creamos la solicitud
      // const result = await userC.deleteInUseUser(user._id, idInstrument)
      const result = {
        success: true,
        message: 'Instrumento en uso eliminado correctamente'
      }
      // console.log(result)
      if(!result.success){
        // io.to(user.clientId).emit('adminResponse', {requ: result?.message})
        return
      }

      //Se envía un mensaje a todos los de la sala de clientes para refrescar la pagina inicial 
      io.to('clientRoom').emit('refreshClientRoom', { requ: true })

      // Para darle una respuesta individual al cliente de la solicitud de no uso
      io.to(user.clientId).emit('adminResponseToClient', {requ: true}) 
    })


    socket.on('disconnect', () => {
      if(admins.has(socket.id)){
        admins.delete(socket.id)
        // console.log('Administrador desconectado')
      }
    })
  })


  return io
}

function getSocket(){
  if (!io) {
    throw new Error('Socket.io no configurado. Asegúrate de llamar a configurarSocket primero.');
  }

  return io;
}

module.exports = {
  configSocket,
  getSocket
}