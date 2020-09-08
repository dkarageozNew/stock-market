import {
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class StockSocketGateway {

    @WebSocketServer()
    public server: Server;

    public sendMessage<T>(type: string, updateData: T): void {
        this.server.emit(type, updateData);
    }
}
