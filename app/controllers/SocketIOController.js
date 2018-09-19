const MappingService = require('../service/mapping.service');

class SocketIOController {

    constructor(node, io) {
        if (!node || !io) {
            throw new Error('Bcoin {Fullnode} and {SocketIO} expected as dependency');
        }

        this.node = node;
        this.io = io;

        this.handleSocket = this.handleSocket.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);

        const nsp = io.of('/socket.io');

        this.io.on('connection', this.handleSocket);
        nsp.on('connection', this.handleSocket);
    }

    async handleSocket(socket) {
        socket.subscriptions = {};

        const txListener = (tx) => {
            socket.emit('tx', MappingService.mapSocketIOTXEvent(tx));
        };

        const blockListener = (block) => {
            socket.emit('block', MappingService.mapSocketIOTXEvent(block));
        };

        //join room
        socket.on('subscribe', (room) => {
            if (room === 'inv') {

                if (!socket.subscriptions['tx']) {
                    this.node.on('tx', txListener);
                    socket.subscriptions['tx'] = txListener;
                }

                if (!socket.subscriptions['block']) {
                    this.node.on('block', blockListener);
                    socket.subscriptions['block'] = blockListener;
                }

            }
        });


        //leave room
        socket.on('unsubscribe', (room) => {
            this.unsubscribe(socket);
        });

        //disconnect from socket
        socket.on('disconnect', () => {
            this.unsubscribe(socket);
        });
    }

    unsubscribe(socket) {
        Object.keys(socket.subscriptions)
            .forEach(event => this.node.removeListener(event, socket.subscriptions[event]));
    }


}

module.exports = SocketIOController;