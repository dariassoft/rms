import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class KitchenGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRestaurant')
  handleJoinRestaurant(client: Socket, tenantId: string) {
    client.join(tenantId);
    console.log(`Client ${client.id} joined room: ${tenantId}`);
  }

  notifyNewOrder(tenantId: string, order: any) {
    this.server.to(tenantId).emit('newOrder', order);
  }

  notifyStatusUpdate(tenantId: string, update: any) {
    this.server.to(tenantId).emit('orderStatusUpdated', update);
  }
}
