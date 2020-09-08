const host = process.env.PROXY_HOST || 'localhost';
const port = process.env.PROXY_PORT || 8080;

const PROXY_CONFIG = {
    "/v1/*": {
        "target": `http://${host}:${port}`,
        "secure": false,
        "logLevel": "debug"
    },
    "/socket.io/*": {
        "target": `ws://${host}:${port}`,
        "secure": false,
        "logLevel": "debug",
        "ws": true
    }
};

module.exports = PROXY_CONFIG;
