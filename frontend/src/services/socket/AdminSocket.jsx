import io from 'socket.io-client'
let socket 

const apiUrl = import.meta.env.VITE_API_URL;

// Iniciar el socket

export const initialSocket = (userId) => {   
  // Obtenemos el token de la cookie o localStorage
  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];

  socket = io(`${apiUrl}`, {  
    withCredentials: true,
    auth: {
      userId: userId,
      token: token
    }
  })
  if(socket && userId) 
    socket.emit('joinAsAdmin', {id: userId})
    return socket;

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
    console.log(response);
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

// Refrescar la sala del administrados
export const refreshAdminRoom = (cb) => {
  if (!socket) return true;
  // Escuchar el evento solo una vez
  socket.on('refreshAdminRoom', (data) => {
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