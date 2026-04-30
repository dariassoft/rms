import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class KitchenGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRestaurant(client: Socket, tenantId: string): void;
    notifyNewOrder(tenantId: string, order: any): void;
    notifyStatusUpdate(tenantId: string, update: any): void;
}
