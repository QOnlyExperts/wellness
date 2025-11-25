import io from 'socket.io-client'
let socket 


const apiUrl = import.meta.env.VITE_API_URL;

// Iniciar el socket
export const initialSocket = (userId) => {
  socket = io(`${apiUrl}:4000`, {  
    auth: {
      userId: userId
    },
    query: { 
      token: sessionStorage.getItem('token')
    }
  });

  if(socket && userId) 
    socket.emit('joinAsClient', {id: userId})
    return socket;
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
export const sendRequestInstrumentToAdmin = (data) => {
  if (socket) {
    console.log(data)
    socket.emit('requestInstrumentToAdmin', data);
  }
}

// Envío de respuestas
export const deleteInstrumentInUse = (data) => {
  if (socket) {
    socket.emit('deleteInstrumentInUse', data);
  }
}

// Respuesta del administrador
export const listenToAdminResponse = (cb) => {
  if (!socket) return true;
  // Nos aseguramos de que solo escuchemos el evento una vez
  socket.on('adminResponseToClient', (data) => {
    cb(null, data);
  });
}

// Refrescar la sala del cliente
export const refreshClientRoom = (cb) => {
  if (!socket) return true;
  // Escuchar el evento solo una vez
  socket.on('refreshClientRoom', (data) => {
    cb(null, data);
  });
}

// Refrescar la sala del cliente
export const requestFailed = (cb) => {
  if (!socket) return true;
  // Escuchar el evento solo una vez
  socket.on('requestFailed', (data) => {
    cb(null, data);
  });
}