const bodyParser = require('body-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { Server } = require('socket.io');
const {createServer} = require('http');


const app = express();
const config = require('./config');
const {configSocket} = require('./application/services/socketService')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

// Configuramos CORS
app.use(cors(config.application.cors.server));


app.use('/', (req, res) => {
  res.send('API v1 de Bienestar UCC funcionando 🚀');
});


// app.use('/api/v1', require('./routes'));

const httpServer = createServer(app);
// Configuramos el socket
configSocket(httpServer);


module.exports = httpServer;

