import io from 'socket.io-client'
let socket 


const apiUrl = import.meta.env.VITE_API_URL;

// Iniciar el socket
export const initialSocket = (user) => {
    console.log(user);
  socket = io(`${apiUrl}:4000`, {query: {token: sessionStorage.getItem('token')}})
  if(socket && user) 
    socket.emit('joinAsClient', user)
    return socket
  // if(socket && user) socket.emit('roomRequest', user)
}
// Desconectar socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;  // Reseteamos el socket para evitar reusos erróneos
  }
}

// Envío de respuestas
export const sendRequestInstrumentToAdmin = (request) => {
  if (socket) {
    socket.emit('requestInstrumentToAdmin', request);
  }
}

// Envío de respuestas
export const deleteInstrumentInUse = (request) => {
  if (socket) {
    socket.emit('deleteInstrumentInUse', request);
  }
}

// Respuesta del administrador
export const listenToAdminResponse = (cb) => {
  if (!socket) return true;
  // Nos aseguramos de que solo escuchemos el evento una vez
  socket.on('adminResponseToClient', (request) => {
    cb(null, request);
  });
}

// Refrescar la sala del cliente
export const refreshClientRoom = (cb) => {
  if (!socket) return true;
  // Escuchar el evento solo una vez
  socket.on('refreshClientRoom', (request) => {
    cb(null, request);
  });
}