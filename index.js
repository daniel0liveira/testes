'use strict'

var app = require('./app');
const http = require('http');
var db = require('./db');
//const debug = require('debug')('nodestr:server');

const server = http.createServer(app);

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

db.obterUsuario('daniel', 'asss', 'sassa').then((data) => console.log(data)).catch((e) => console.log(e));


server.listen(port, '127.0.0.1');

server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }

}

function onListening() {
    const addr = server.address();
    console.log(addr);
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
