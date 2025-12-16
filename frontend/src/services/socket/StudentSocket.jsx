import io from 'socket.io-client'
let socket;

const apiUrl = import.meta.env.VITE_API_URL;

export const initialSocket = (userId) => {
  if (!socket) {
    socket = io(apiUrl, {
      auth: { userId },
      transports: ["websocket", "polling"],
      withCredentials: true, // permite enviar cookies
    });

    socket.on("connect", () => {
      if (userId) {
        socket.emit("joinAsAdmin", { id: userId });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Error al conectar socket:", err.message);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export const sendRequestInstrumentToAdmin = (data) => {
  if (socket) socket.emit('requestInstrumentToAdmin', data);
}

export const sendFinishRequestInstrumentToAdmin = (data) => {
  if (socket) socket.emit('finishRequestInstrumentToAdmin', data);
}

export const deleteInstrumentInUse = (data) => {
  if (socket) socket.emit('deleteInstrumentInUse', data);
}

// Listeners
export const listenToAdminResponse = (cb) => {
  if (!socket) return;
  socket.off('adminResponseToClient'); // eliminamos listener previo
  socket.on('adminResponseToClient', cb);
}

export const refreshClientRoom = (cb) => {
  if (!socket) return;
  socket.off('refreshClientRoom');
  socket.on('refreshClientRoom', cb);
}

export const requestFailed = (cb) => {
  if (!socket) return;
  socket.off('requestFailed');
  socket.on('requestFailed', cb);
}
