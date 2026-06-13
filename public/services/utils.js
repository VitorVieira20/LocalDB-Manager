const net = require('net');

function checkPort(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', () => resolve(false));
        server.once('listening', () => {
            server.close(() => resolve(true));
        });
        server.listen(port);
    });
}

async function findAvailablePort(start, end) {
    for (let port = start; port <= end; port++) {
        if (await checkPort(port)) return port;
    }
    throw new Error(`Nenhuma porta disponível no intervalo ${start}-${end}`);
}

module.exports = { findAvailablePort };