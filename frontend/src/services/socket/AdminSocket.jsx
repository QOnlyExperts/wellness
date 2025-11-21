import io from 'socket.io-client'
let socket 

const apiUrl = import.meta.env.VITE_API_URL;

// Iniciar el socket
export const initialSocket = (user) => {
  
  socket = io(`${apiUrl}:4000`, {query: {token: sessionStorage.getItem('token')}})
  if(socket && user) 
    socket.emit('joinAsAdmin', user)
    return socket

}

// Desconectar socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;  // Reseteamos el socket para evitar reusos erróneos
  }
}

export const sendResponseToClient = (response) => {
  if(socket){
    socket.emit('responseToClient', response)
  }
}

// Escucha al canal adminRequest de el servidor
export const listenToAdminRequest = (cb) => {
  if(!socket) return true
  socket.on('adminRequestFromClient', (request) => {
    return cb(null, request)
  })
}